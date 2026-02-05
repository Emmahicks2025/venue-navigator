import { useState, useEffect, useRef, useCallback } from 'react';
import { SVGSection } from '@/lib/svgParser';
import { formatPrice } from '@/data/events';
import { cn } from '@/lib/utils';

// Calculate available tickets for a section (mock - based on section data)
export const getAvailableTickets = (section: SVGSection): number => {
  const totalSeats = section.rows * section.seatsPerRow;
  // Mock availability: 60-95% of seats available based on price (higher price = fewer available)
  const availabilityRate = 0.6 + (Math.random() * 0.35);
  return Math.floor(totalSeats * availabilityRate);
};

interface InteractiveSVGMapProps {
  svgContent: string;
  sections: SVGSection[];
  selectedSection: string | null;
  onSectionSelect: (sectionId: string) => void;
}

export const InteractiveSVGMap = ({
  svgContent,
  sections,
  selectedSection,
  onSectionSelect,
}: InteractiveSVGMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create a section lookup map
  const sectionMap = new Map(sections.map(s => [s.id, s]));

  // Process SVG content to add our styles
  const processedSVG = useCallback(() => {
    // Parse the SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) return svgContent;

    // Add viewBox if missing for responsiveness
    if (!svg.getAttribute('viewBox')) {
      const width = svg.getAttribute('width') || '800';
      const height = svg.getAttribute('height') || '600';
      svg.setAttribute('viewBox', `0 0 ${parseFloat(width)} ${parseFloat(height)}`);
    }

    // Make it responsive
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Add styling for sections
    const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      /* Hide embedded info boxes, overlays, and instructions from SVG */
      .info-box, .venue-info, .title-group, .overlay-info,
      [id*="info-box"], [id*="info_box"], [id*="infobox"],
      [id*="overlay"], [id*="tooltip"], [id*="instructions"],
      [class*="info-box"], [class*="overlay"], [class*="tooltip"],
      foreignObject, .foreignObject,
      [data-info], [data-overlay] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* Hide floating text elements that are not inside section groups */
      svg > text,
      svg > g:not([data-section-id]) > text {
        display: none !important;
      }

      g[data-section-id] {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      g[data-section-id]:hover > path,
      g[data-section-id]:hover > polygon,
      g[data-section-id]:hover > rect {
        filter: brightness(1.3);
      }
      g[data-section-id].selected > path,
      g[data-section-id].selected > polygon,
      g[data-section-id].selected > rect {
        stroke: #0ea5e9 !important;
        stroke-width: 3px !important;
      }
      g[data-section-id][data-available="false"] {
        opacity: 0.4;
        cursor: not-allowed;
      }
    `;
    
    // Remove floating text elements that are not part of interactive sections
    // This targets standalone text/tspan elements that show section numbers, labels etc.
    const removeFloatingElements = (parent: Element) => {
      // Remove text elements not inside data-section-id groups
      parent.querySelectorAll('text').forEach(textEl => {
        const parentSection = textEl.closest('g[data-section-id]');
        if (!parentSection) {
          // Check if it's a stage label we want to keep
          const content = textEl.textContent?.toLowerCase() || '';
          if (!content.includes('stage') && !content.includes('floor') && !content.includes('court')) {
            textEl.remove();
          }
        }
      });
      
      // Remove tspan elements that might be floating
      parent.querySelectorAll('tspan').forEach(tspan => {
        const parentSection = tspan.closest('g[data-section-id]');
        if (!parentSection) {
          tspan.remove();
        }
      });
    };
    
    // Remove info elements and overlays
    const infoSelectors = [
      'foreignObject',
      '[id*="info"]',
      '[id*="overlay"]',
      '[id*="tooltip"]',
      'g[opacity="0.9"]',
      'rect[fill="#333333"]',
      '[id*="label"]',
      '[id*="text"]',
      '[class*="label"]',
    ];
    
    infoSelectors.forEach(selector => {
      try {
        svg.querySelectorAll(selector).forEach(el => {
          // Check if it's inside a section group - if so, keep it
          const parentSection = el.closest('g[data-section-id]');
          if (!parentSection) {
            // Check if it contains instruction text
            const text = el.textContent || '';
            if (text.includes('Click a section') || 
                text.includes('see details') ||
                text.match(/^\d+$/) || // Pure numbers
                text.match(/^[A-Z]\d*$/)) { // Letters like "A", "B1", etc.
              el.remove();
            }
          }
        });
      } catch (e) {
        // Selector might be invalid, continue
      }
    });
    
    // Remove any groups containing the info overlay text
    svg.querySelectorAll('g').forEach(g => {
      const text = g.textContent || '';
      // Remove instruction overlays
      if (text.includes('Click a section') && text.includes('see details')) {
        g.remove();
        return;
      }
      // Remove groups that only contain floating numbers/labels (not section groups)
      if (!g.hasAttribute('data-section-id') && !g.querySelector('[data-section-id]')) {
        const childrenCount = g.children.length;
        const textCount = g.querySelectorAll('text, tspan').length;
        // If the group is mostly text elements and not a recognized structure
        if (childrenCount > 0 && textCount === childrenCount) {
          const allText = text.trim();
          // Remove if it's just numbers or short labels
          if (allText.match(/^[\d\s]+$/) || allText.length < 5) {
            // Keep groups with structural elements
            if (!g.querySelector('path, polygon, rect, circle')) {
              g.remove();
            }
          }
        }
      }
    });
    
    // Clean floating text elements
    removeFloatingElements(svg);

    svg.insertBefore(style, svg.firstChild);

    return new XMLSerializer().serializeToString(doc);
  }, [svgContent]);

  // Handle section interactions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const sectionGroup = target.closest('g[data-section-id]');
      
      if (sectionGroup) {
        const sectionId = sectionGroup.getAttribute('data-section-id');
        const available = sectionGroup.getAttribute('data-available') !== 'false';
        
        if (sectionId && available) {
          onSectionSelect(sectionId);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as Element;
      const sectionGroup = target.closest('g[data-section-id]');
      
      if (sectionGroup) {
        const sectionId = sectionGroup.getAttribute('data-section-id');
        if (sectionId) {
          setHoveredSection(sectionId);
          // Get position relative to container
          const rect = container.getBoundingClientRect();
          setTooltipPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      } else {
        setHoveredSection(null);
      }
    };

    const handleMouseLeave = () => {
      setHoveredSection(null);
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onSectionSelect]);

  // Update selected state in SVG
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove selected class from all sections
    container.querySelectorAll('g[data-section-id].selected').forEach(el => {
      el.classList.remove('selected');
    });

    // Add selected class to current selection
    if (selectedSection) {
      const selected = container.querySelector(`g[data-section-id="${selectedSection}"]`);
      if (selected) {
        selected.classList.add('selected');
      }
    }
  }, [selectedSection]);

  const hoveredData = hoveredSection ? sectionMap.get(hoveredSection) : null;

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/60 border border-accent" />
          <span className="text-muted-foreground">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/50 border border-primary" />
          <span className="text-muted-foreground">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/50 border border-success" />
          <span className="text-muted-foreground">Value</span>
        </div>
      </div>

      {/* SVG Container */}
      <div 
        ref={containerRef}
        className="relative w-full bg-secondary/30 rounded-xl p-4 overflow-hidden"
        style={{ minHeight: '400px' }}
        dangerouslySetInnerHTML={{ __html: processedSVG() }}
      />

      {/* Hover Tooltip */}
      {hoveredData && (
        <div
          className="absolute z-50 pointer-events-none bg-card border border-border rounded-lg p-3 shadow-xl animate-fade-in"
          style={{
            left: Math.min(tooltipPosition.x + 10, (containerRef.current?.clientWidth || 300) - 160),
            top: tooltipPosition.y - 80,
          }}
        >
          <p className="font-semibold text-foreground text-sm mb-1">
            {hoveredData.name}
          </p>
          <p className="text-xs text-muted-foreground mb-1">
            {getAvailableTickets(hoveredData)} tickets available
          </p>
          <p className="text-accent font-bold">
            {formatPrice(hoveredData.currentPrice)}
          </p>
        </div>
      )}
    </div>
  );
};
