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
      .section-label {
        pointer-events: none;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
        fill: white;
        text-anchor: middle;
        dominant-baseline: central;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      }
    `;
    
    // AGGRESSIVE REMOVAL: Remove ALL text elements
    svg.querySelectorAll('text, tspan').forEach(textEl => {
      textEl.remove();
    });
    
    // Remove foreignObject elements (often contain overlays)
    svg.querySelectorAll('foreignObject').forEach(el => el.remove());
    
    // Remove any groups with info/overlay in id or class
    svg.querySelectorAll('[id*="info"], [id*="overlay"], [id*="tooltip"], [class*="info"], [class*="overlay"]').forEach(el => {
      if (!el.closest('g[data-section-id]')) {
        el.remove();
      }
    });

    // Add section labels programmatically
    svg.querySelectorAll('g[data-section-id]').forEach(sectionGroup => {
      const sectionId = sectionGroup.getAttribute('data-section-id') || '';
      
      // Get the bounding box of the section's shape
      const shape = sectionGroup.querySelector('path, polygon, rect, circle, ellipse');
      if (!shape) return;
      
      // Get bounding box from the shape
      let cx = 0, cy = 0, width = 0, height = 0;
      
      if (shape.tagName === 'rect') {
        const x = parseFloat(shape.getAttribute('x') || '0');
        const y = parseFloat(shape.getAttribute('y') || '0');
        width = parseFloat(shape.getAttribute('width') || '0');
        height = parseFloat(shape.getAttribute('height') || '0');
        cx = x + width / 2;
        cy = y + height / 2;
      } else if (shape.tagName === 'circle') {
        cx = parseFloat(shape.getAttribute('cx') || '0');
        cy = parseFloat(shape.getAttribute('cy') || '0');
        const r = parseFloat(shape.getAttribute('r') || '0');
        width = height = r * 2;
      } else if (shape.tagName === 'ellipse') {
        cx = parseFloat(shape.getAttribute('cx') || '0');
        cy = parseFloat(shape.getAttribute('cy') || '0');
        width = parseFloat(shape.getAttribute('rx') || '0') * 2;
        height = parseFloat(shape.getAttribute('ry') || '0') * 2;
      } else {
        // For path/polygon, try to get bounds from d attribute or points
        const bbox = getPathBounds(shape);
        cx = bbox.cx;
        cy = bbox.cy;
        width = bbox.width;
        height = bbox.height;
      }
      
      // Calculate font size based on section size (with min/max constraints)
      const minDimension = Math.min(width, height);
      let fontSize = Math.max(6, Math.min(14, minDimension * 0.35));
      
      // Get a short label for the section
      const label = getShortLabel(sectionId);
      
      // Adjust font size for longer labels
      if (label.length > 4) {
        fontSize = fontSize * 0.8;
      }
      if (label.length > 6) {
        fontSize = fontSize * 0.8;
      }
      
      // Create the text element
      const text = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'section-label');
      text.setAttribute('x', String(cx));
      text.setAttribute('y', String(cy));
      text.setAttribute('font-size', String(fontSize));
      text.textContent = label;
      
      sectionGroup.appendChild(text);
    });

    svg.insertBefore(style, svg.firstChild);

    return new XMLSerializer().serializeToString(doc);
  }, [svgContent]);
  
  // Helper function to get bounds of path/polygon elements
  const getPathBounds = (shape: Element): { cx: number; cy: number; width: number; height: number } => {
    let points: { x: number; y: number }[] = [];
    
    if (shape.tagName === 'polygon') {
      const pointsAttr = shape.getAttribute('points') || '';
      const pairs = pointsAttr.trim().split(/[\s,]+/);
      for (let i = 0; i < pairs.length - 1; i += 2) {
        points.push({ x: parseFloat(pairs[i]), y: parseFloat(pairs[i + 1]) });
      }
    } else if (shape.tagName === 'path') {
      // Extract numbers from path d attribute for rough bounds
      const d = shape.getAttribute('d') || '';
      const numbers = d.match(/-?\d+\.?\d*/g) || [];
      for (let i = 0; i < numbers.length - 1; i += 2) {
        const x = parseFloat(numbers[i]);
        const y = parseFloat(numbers[i + 1]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    }
    
    if (points.length === 0) {
      return { cx: 0, cy: 0, width: 50, height: 50 };
    }
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY,
    };
  };
  
  // Get a short display label from section ID
  const getShortLabel = (sectionId: string): string => {
    // Remove common prefixes
    let label = sectionId
      .replace(/^(SECTION[-_]?|SEC[-_]?|ZONE[-_]?)/i, '')
      .replace(/[-_]GROUP$/i, '')
      .replace(/[-_]/g, ' ')
      .trim();
    
    // If it's just a number, return it
    if (/^\d+$/.test(label)) {
      return label;
    }
    
    // If it's a letter+number combo (like A1, B2), return it
    if (/^[A-Z]\d+$/i.test(label)) {
      return label.toUpperCase();
    }
    
    // For longer names, abbreviate
    const parts = label.split(/\s+/);
    if (parts.length === 1) {
      // Single word - take first 4 chars
      return label.substring(0, 4).toUpperCase();
    }
    
    // Multiple words - take initials + numbers
    let result = '';
    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        result += part;
      } else {
        result += part[0];
      }
    }
    return result.toUpperCase();
  };

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
