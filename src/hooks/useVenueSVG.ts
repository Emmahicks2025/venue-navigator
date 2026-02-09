import { useState, useEffect } from 'react';
import { SVGSection, parseSVGSections } from '@/lib/svgParser';

const FALLBACK_MAP = '_general';

interface UseVenueSVGResult {
  svgContent: string | null;
  sections: SVGSection[];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

// Normalize venue name for SVG filename lookup
// Handles special characters that cause issues with dev server
function normalizeVenueName(name: string): string {
  // Replace & with empty (AT&T -> ATT) to match renamed files
  return name.replace(/&/g, '');
}

async function fetchSVG(name: string): Promise<{ content: string; sections: SVGSection[] }> {
  // Normalize the venue name to handle special characters like &
  const normalizedName = normalizeVenueName(name);
  // URL-encode the filename segment for spaces and other chars
  const safeName = encodeURIComponent(normalizedName);
  const response = await fetch(`/venue-maps/${safeName}.svg`);
  if (!response.ok) throw new Error(`Failed to load venue map: ${response.status}`);
  const content = await response.text();
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

    const loadSVG = async () => {
      setLoading(true);
      setError(null);
      setIsFallback(false);

      try {
        // Try the venue-specific map first
        const result = await fetchSVG(venueName);

        // If the SVG loaded but has no interactive sections, treat as failure
        if (result.sections.length === 0) {
          throw new Error('Map has no interactive sections');
        }

        setSvgContent(result.content);
        setSections(result.sections);
      } catch (primaryErr) {
        console.warn(`Primary map failed for "${venueName}", loading fallback...`, primaryErr);

        // Don't retry fallback if we already tried it
        if (venueName === FALLBACK_MAP) {
          setError('Failed to load venue map');
          setSvgContent(null);
          setSections([]);
          setLoading(false);
          return;
        }

        try {
          const fallback = await fetchSVG(FALLBACK_MAP);
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
