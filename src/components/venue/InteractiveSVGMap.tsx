import { useEffect, useRef, useState, useCallback } from 'react';
import { SVGSection } from '@/lib/svgParser';
import { formatPrice } from '@/data/events';
import { cn } from '@/lib/utils';

// Calculate available tickets for a section (mock - based on section data)
export const getAvailableTickets = (section: SVGSection): number => {
  const totalSeats = section.rows * section.seatsPerRow;
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

  const sectionMap = new Map(sections.map(s => [s.id, s]));

  // Process SVG content: remove embedded overlays/text, make responsive
  const processedSVG = useCallback(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) return svgContent;

    if (!svg.getAttribute('viewBox')) {
      const width = svg.getAttribute('width') || '800';
      const height = svg.getAttribute('height') || '600';
      svg.setAttribute('viewBox', `0 0 ${parseFloat(width)} ${parseFloat(height)}`);
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Remove ALL text elements
    svg.querySelectorAll('text, tspan').forEach(el => el.remove());

    // Remove foreignObject elements
    svg.querySelectorAll('foreignObject').forEach(el => el.remove());

    // Remove common overlay/info containers
    svg
      .querySelectorAll(
        '[id*="info"], [id*="overlay"], [id*="tooltip"], [class*="info"], [class*="overlay"], [class*="tooltip"]'
      )
      .forEach(el => {
        if (!el.closest('g[data-section-id]')) el.remove();
      });

    const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
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

    const handleMouseLeave = () => setHoveredSection(null);

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

    container.querySelectorAll('g[data-section-id].selected').forEach(el => {
      el.classList.remove('selected');
    });

    if (selectedSection) {
      const selected = container.querySelector(`g[data-section-id="${selectedSection}"]`);
      if (selected) selected.classList.add('selected');
    }
  }, [selectedSection]);

  const hoveredData = hoveredSection ? sectionMap.get(hoveredSection) : null;

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary border border-primary" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-muted-foreground/30" />
          <span className="text-muted-foreground">Not Available</span>
        </div>
      </div>

      {/* SVG Container */}
      <div
        ref={containerRef}
        className={cn('relative w-full bg-secondary/30 rounded-xl p-4 overflow-hidden')}
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
          <p className="font-semibold text-foreground text-sm mb-1">{hoveredData.name}</p>
          <p className="text-xs text-muted-foreground mb-1">{getAvailableTickets(hoveredData)} tickets available</p>
          <p className="text-accent font-bold">{formatPrice(hoveredData.currentPrice)}</p>
        </div>
      )}
    </div>
  );
};
