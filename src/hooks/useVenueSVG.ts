import { useState, useEffect } from 'react';
import { SVGSection, parseSVGSections } from '@/lib/svgParser';
import { getVenueMapSVG } from '@/data/venueMapRegistry';

const FALLBACK_MAP = '_general';

interface UseVenueSVGResult {
  svgContent: string | null;
  sections: SVGSection[];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

// Normalize venue name for SVG filename lookup
function normalizeVenueName(name: string): string {
  return name.replace(/&/g, '');
}

function loadSVGFromRegistry(name: string): { content: string; sections: SVGSection[] } {
  const normalizedName = normalizeVenueName(name);
  console.log(`[VenueSVG] Loading from registry: "${normalizedName}" (original: "${name}")`);
  
  const content = getVenueMapSVG(normalizedName);
  if (!content) {
    throw new Error(`Venue map not found in registry: ${normalizedName}`);
  }
  
  const sections = parseSVGSections(content);
  return { content, sections };
}

export function useVenueSVG(venueName: string | undefined): UseVenueSVGResult {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [sections, setSections] = useState<SVGSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!venueName) {
      setLoading(false);
      return;
    }

    const loadSVG = () => {
      setLoading(true);
      setError(null);
      setIsFallback(false);

      try {
        const result = loadSVGFromRegistry(venueName);

        if (result.sections.length === 0) {
          throw new Error('Map has no interactive sections');
        }

        setSvgContent(result.content);
        setSections(result.sections);
      } catch (primaryErr) {
        console.warn(`Primary map failed for "${venueName}", loading fallback...`, primaryErr);

        if (venueName === FALLBACK_MAP) {
          setError('Failed to load venue map');
          setSvgContent(null);
          setSections([]);
          setLoading(false);
          return;
        }

        try {
          const fallback = loadSVGFromRegistry(FALLBACK_MAP);
          setSvgContent(fallback.content);
          setSections(fallback.sections);
          setIsFallback(true);
        } catch (fallbackErr) {
          console.error('Fallback map also failed:', fallbackErr);
          setError('Failed to load venue map');
          setSvgContent(null);
          setSections([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSVG();
  }, [venueName]);

  return { svgContent, sections, loading, error, isFallback };
}
