import { useState } from 'react';
import { VenueSection } from '@/types';
import { formatPrice } from '@/data/events';
import { cn } from '@/lib/utils';

interface VenueMapProps {
  sections: VenueSection[];
  selectedSection: string | null;
  onSectionSelect: (sectionId: string) => void;
}

export const VenueMap = ({ sections, selectedSection, onSectionSelect }: VenueMapProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const getSectionClass = (section: VenueSection) => {
    const isSelected = selectedSection === section.id;
    const isHovered = hoveredSection === section.id;

    if (isSelected) return 'fill-accent stroke-accent stroke-2';
    if (isHovered) return 'fill-primary/70 stroke-primary stroke-2';

    switch (section.priceCategory) {
      case 'premium':
        return 'section-premium';
      case 'standard':
        return 'section-standard';
      case 'value':
        return 'section-value';
      default:
        return 'fill-muted stroke-muted-foreground';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
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

      {/* SVG Arena Map */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Stage */}
        <rect
          x="120"
          y="20"
          width="160"
          height="40"
          rx="8"
          className="fill-secondary stroke-muted-foreground stroke-1"
        />
        <text x="200" y="45" textAnchor="middle" className="fill-muted-foreground text-xs font-medium">
          STAGE
        </text>

        {/* Floor Section */}
        {sections.find(s => s.id.includes('floor') || s.id.includes('courtside')) && (
          <rect
            x="130"
            y="70"
            width="140"
            height="60"
            rx="4"
            className={cn(
              'cursor-pointer transition-all duration-200',
              getSectionClass(sections.find(s => s.id.includes('floor') || s.id.includes('courtside'))!)
            )}
            onClick={() => onSectionSelect(sections.find(s => s.id.includes('floor') || s.id.includes('courtside'))!.id)}
            onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('floor') || s.id.includes('courtside'))!.id)}
            onMouseLeave={() => setHoveredSection(null)}
          />
        )}
        <text x="200" y="105" textAnchor="middle" className="fill-foreground text-[10px] font-medium pointer-events-none">
          FLOOR
        </text>

        {/* Lower Sections - Left */}
        <path
          d="M40 80 L120 70 L120 130 L40 150 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('lower-100')) || sections[1])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('lower-100'))?.id || sections[1]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('lower-100'))?.id || sections[1]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />
        <text x="80" y="115" textAnchor="middle" className="fill-foreground text-[8px] font-medium pointer-events-none">
          LOWER 100s
        </text>

        {/* Lower Sections - Right */}
        <path
          d="M280 70 L360 80 L360 150 L280 130 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('lower-100')) || sections[1])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('lower-100'))?.id || sections[1]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('lower-100'))?.id || sections[1]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />
        <text x="320" y="115" textAnchor="middle" className="fill-foreground text-[8px] font-medium pointer-events-none">
          LOWER 100s
        </text>

        {/* Lower Sections - Bottom */}
        <path
          d="M80 160 L320 160 L340 200 L60 200 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('lower-200') || s.id.includes('club')) || sections[2])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('lower-200') || s.id.includes('club'))?.id || sections[2]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('lower-200') || s.id.includes('club'))?.id || sections[2]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />
        <text x="200" y="182" textAnchor="middle" className="fill-foreground text-[8px] font-medium pointer-events-none">
          LOWER 200s
        </text>

        {/* Upper Sections - Left */}
        <path
          d="M20 60 L35 78 L35 155 L20 175 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('upper')) || sections[3])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('upper'))?.id || sections[3]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('upper'))?.id || sections[3]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />

        {/* Upper Sections - Right */}
        <path
          d="M365 78 L380 60 L380 175 L365 155 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('upper')) || sections[3])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('upper'))?.id || sections[3]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('upper'))?.id || sections[3]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />

        {/* Upper Sections - Bottom */}
        <path
          d="M50 210 L350 210 L370 250 L30 250 Z"
          className={cn(
            'cursor-pointer transition-all duration-200',
            getSectionClass(sections.find(s => s.id.includes('upper-300') || s.id.includes('upper-400')) || sections[sections.length - 1])
          )}
          onClick={() => onSectionSelect(sections.find(s => s.id.includes('upper-300') || s.id.includes('upper-400'))?.id || sections[sections.length - 1]?.id)}
          onMouseEnter={() => setHoveredSection(sections.find(s => s.id.includes('upper-300') || s.id.includes('upper-400'))?.id || sections[sections.length - 1]?.id)}
          onMouseLeave={() => setHoveredSection(null)}
        />
        <text x="200" y="232" textAnchor="middle" className="fill-foreground text-[8px] font-medium pointer-events-none">
          UPPER 300s
        </text>
      </svg>

      {/* Hovered Section Info */}
      {hoveredSection && (
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-fade-in">
          <p className="font-semibold text-foreground text-sm">
            {sections.find(s => s.id === hoveredSection)?.name}
          </p>
          <p className="text-accent font-bold">
            From {formatPrice(sections.find(s => s.id === hoveredSection)?.basePrice || 0)}
          </p>
        </div>
      )}
    </div>
  );
};
