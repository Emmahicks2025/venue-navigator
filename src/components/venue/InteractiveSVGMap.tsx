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

type SectionLabel = {
  sectionId: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
};

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

export const InteractiveSVGMap = ({
  svgContent,
  sections,
  selectedSection,
  onSectionSelect,
}: InteractiveSVGMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [labels, setLabels] = useState<SectionLabel[]>([]);

  // Create a section lookup map
  const sectionMap = new Map(sections.map(s => [s.id, s]));

  // Process SVG content to remove embedded overlays/text and add consistent section styles
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

    // Remove *all* text (we'll render labels as an overlay for consistent sizing/position)
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

    svg.insertBefore(style, svg.firstChild);

    return new XMLSerializer().serializeToString(doc);
  }, [svgContent]);

  // Compute label positions from the *rendered* SVG so they stay aligned across maps
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let ro: ResizeObserver | null = null;

    const compute = () => {
      const svg = container.querySelector('svg') as SVGSVGElement | null;
      if (!svg) return;

      const next: SectionLabel[] = [];
      const sectionGroups = svg.querySelectorAll('g[data-section-id]');

      sectionGroups.forEach(group => {
        const sectionId = group.getAttribute('data-section-id') || '';
        if (!sectionId) return;

        // getBBox gives us the geometry bounds in SVG user units.
        // This is reliable for centering labels (unlike parsing path data).
        let bbox: DOMRect;
        try {
          bbox = (group as unknown as SVGGElement).getBBox();
        } catch {
          return;
        }

        if (!isFinite(bbox.x) || !isFinite(bbox.y) || bbox.width <= 1 || bbox.height <= 1) return;

        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const minDim = Math.min(bbox.width, bbox.height);
        // A stable clamp that avoids huge/small swings across venues
        let fontSize = Math.max(10, Math.min(18, minDim * 0.22));

        const label = getShortLabel(sectionId);
        if (label.length > 4) fontSize *= 0.9;
        if (label.length > 6) fontSize *= 0.85;

        next.push({ sectionId, label, x: cx, y: cy, fontSize });
      });

      setLabels(next);
    };

    raf = window.requestAnimationFrame(compute);

    ro = new ResizeObserver(() => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(compute);
    });
    ro.observe(container);

    return () => {
      window.cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [svgContent, sections]);

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

      {/* Overlay labels (stable sizing & alignment) */}
      <div className="absolute inset-0 pointer-events-none">
        {labels.map(l => (
          <div
            key={l.sectionId}
            className="absolute font-semibold text-foreground select-none"
            style={{
              left: l.x,
              top: l.y,
              transform: 'translate(-50%, -50%)',
              fontSize: `${l.fontSize}px`,
              lineHeight: 1,
              textShadow:
                '0 1px 0 hsl(var(--background) / 0.95), 0 0 6px hsl(var(--background) / 0.95), 0 2px 10px hsl(var(--background) / 0.85)',
              whiteSpace: 'nowrap',
            }}
          >
            {l.label}
          </div>
        ))}
      </div>

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
