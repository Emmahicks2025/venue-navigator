import { useEffect, useRef, useState, useCallback } from 'react';
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

// Get a short display label from section ID
const getShortLabel = (sectionId: string): string => {
  let label = sectionId
    .replace(/^(SECTION[-_]?|SEC[-_]?|ZONE[-_]?)/i, '')
    .replace(/[-_]GROUP$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  if (!label) return sectionId;

  // Just a number
  if (/^\d+$/.test(label)) return label;

  // Letter+number (A1, B12)
  if (/^[A-Z]\d+$/i.test(label)) return label.toUpperCase();

  // Shorten long names
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return label.substring(0, 5).toUpperCase();

  let result = '';
  for (const part of parts) {
    if (/^\d+$/.test(part)) result += part;
    else result += part[0];
  }
  return result.toUpperCase();
};

// Parse path d attribute to get bounding box
const getPathBounds = (d: string): { minX: number; minY: number; maxX: number; maxY: number } | null => {
  const coords: { x: number; y: number }[] = [];
  
  // Match all coordinate pairs in the path
  const regex = /([MLHVCSQTAZ])\s*([^MLHVCSQTAZ]*)/gi;
  let match;
  let currentX = 0;
  let currentY = 0;
  
  while ((match = regex.exec(d)) !== null) {
    const cmd = match[1].toUpperCase();
    const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    
    if (cmd === 'M' || cmd === 'L') {
      for (let i = 0; i < args.length; i += 2) {
        if (!isNaN(args[i]) && !isNaN(args[i + 1])) {
          currentX = args[i];
          currentY = args[i + 1];
          coords.push({ x: currentX, y: currentY });
        }
      }
    } else if (cmd === 'H') {
      for (const x of args) {
        if (!isNaN(x)) {
          currentX = x;
          coords.push({ x: currentX, y: currentY });
        }
      }
    } else if (cmd === 'V') {
      for (const y of args) {
        if (!isNaN(y)) {
          currentY = y;
          coords.push({ x: currentX, y: currentY });
        }
      }
    } else if (cmd === 'C') {
      // Cubic bezier - take endpoints
      for (let i = 0; i < args.length; i += 6) {
        if (!isNaN(args[i + 4]) && !isNaN(args[i + 5])) {
          currentX = args[i + 4];
          currentY = args[i + 5];
          coords.push({ x: currentX, y: currentY });
        }
      }
    } else if (cmd === 'Q') {
      // Quadratic bezier - take endpoints
      for (let i = 0; i < args.length; i += 4) {
        if (!isNaN(args[i + 2]) && !isNaN(args[i + 3])) {
          currentX = args[i + 2];
          currentY = args[i + 3];
          coords.push({ x: currentX, y: currentY });
        }
      }
    }
  }
  
  if (coords.length === 0) return null;
  
  const xs = coords.map(c => c.x);
  const ys = coords.map(c => c.y);
  
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
};

// Parse polygon points attribute to get bounding box
const getPolygonBounds = (points: string): { minX: number; minY: number; maxX: number; maxY: number } | null => {
  const coords = points.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  if (coords.length < 4) return null;
  
  const xs: number[] = [];
  const ys: number[] = [];
  
  for (let i = 0; i < coords.length; i += 2) {
    xs.push(coords[i]);
    ys.push(coords[i + 1]);
  }
  
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
};

// Get rect bounds
const getRectBounds = (rect: Element): { minX: number; minY: number; maxX: number; maxY: number } | null => {
  const x = parseFloat(rect.getAttribute('x') || '0');
  const y = parseFloat(rect.getAttribute('y') || '0');
  const width = parseFloat(rect.getAttribute('width') || '0');
  const height = parseFloat(rect.getAttribute('height') || '0');
  
  if (width <= 0 || height <= 0) return null;
  
  return {
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
  };
};

// Calculate the center and dimensions of a section group
const getSectionGeometry = (group: Element): { cx: number; cy: number; width: number; height: number } | null => {
  let allBounds: { minX: number; minY: number; maxX: number; maxY: number }[] = [];
  
  // Check paths
  group.querySelectorAll('path').forEach(path => {
    const d = path.getAttribute('d');
    if (d) {
      const bounds = getPathBounds(d);
      if (bounds) allBounds.push(bounds);
    }
  });
  
  // Check polygons
  group.querySelectorAll('polygon').forEach(polygon => {
    const points = polygon.getAttribute('points');
    if (points) {
      const bounds = getPolygonBounds(points);
      if (bounds) allBounds.push(bounds);
    }
  });
  
  // Check rects
  group.querySelectorAll('rect').forEach(rect => {
    const bounds = getRectBounds(rect);
    if (bounds) allBounds.push(bounds);
  });
  
  if (allBounds.length === 0) return null;
  
  // Merge all bounds
  const minX = Math.min(...allBounds.map(b => b.minX));
  const minY = Math.min(...allBounds.map(b => b.minY));
  const maxX = Math.max(...allBounds.map(b => b.maxX));
  const maxY = Math.max(...allBounds.map(b => b.maxY));
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  if (width <= 0 || height <= 0) return null;
  
  return {
    cx: minX + width / 2,
    cy: minY + height / 2,
    width,
    height,
  };
};

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

  // Process SVG content: remove embedded overlays/text and inject our own labels
  const processedSVG = useCallback(() => {
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

    // Remove ALL existing text elements - we'll add our own
    svg.querySelectorAll('text, tspan').forEach(el => el.remove());

    // Remove foreignObject elements (often contain overlays)
    svg.querySelectorAll('foreignObject').forEach(el => el.remove());

    // Remove common overlay/info containers
    svg
      .querySelectorAll(
        '[id*="info"], [id*="overlay"], [id*="tooltip"], [class*="info"], [class*="overlay"], [class*="tooltip"]'
      )
      .forEach(el => {
        if (!el.closest('g[data-section-id]')) el.remove();
      });

    // Add styles for interactivity and labels
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
        text-anchor: middle;
        dominant-baseline: central;
        font-weight: 700;
        font-family: system-ui, -apple-system, sans-serif;
        fill: white;
        stroke: rgba(0,0,0,0.85);
        stroke-width: 3px;
        paint-order: stroke fill;
        pointer-events: none;
      }
    `;
    svg.insertBefore(style, svg.firstChild);

    // Inject labels into each section group
    const sectionGroups = svg.querySelectorAll('g[data-section-id]');
    sectionGroups.forEach(group => {
      const sectionId = group.getAttribute('data-section-id');
      if (!sectionId) return;

      const geometry = getSectionGeometry(group);
      if (!geometry) return;

      const { cx, cy, width, height } = geometry;
      const minDim = Math.min(width, height);
      
      // Calculate font size based on section dimensions
      let fontSize = Math.max(10, Math.min(24, minDim * 0.3));
      
      const label = getShortLabel(sectionId);
      
      // Reduce font size for longer labels
      if (label.length > 4) fontSize *= 0.85;
      if (label.length > 6) fontSize *= 0.8;

      // Create and position the text element
      const text = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(cx));
      text.setAttribute('y', String(cy));
      text.setAttribute('class', 'section-label');
      text.setAttribute('font-size', String(fontSize));
      text.textContent = label;
      
      group.appendChild(text);
    });

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
