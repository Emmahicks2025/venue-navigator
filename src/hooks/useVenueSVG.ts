import { useState, useEffect } from 'react';
import { SVGSection, parseSVGSections } from '@/lib/svgParser';

interface UseVenueSVGResult {
  svgContent: string | null;
  sections: SVGSection[];
  loading: boolean;
  error: string | null;
}

export function useVenueSVG(venueName: string | undefined): UseVenueSVGResult {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [sections, setSections] = useState<SVGSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!venueName) {
      setLoading(false);
      return;
    }

    const loadSVG = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/venue-maps/${venueName}.svg`);
        
        if (!response.ok) {
          throw new Error(`Failed to load venue map: ${response.status}`);
        }
        
        const content = await response.text();
        const parsedSections = parseSVGSections(content);
        
        setSvgContent(content);
        setSections(parsedSections);
      } catch (err) {
        console.error('Error loading venue SVG:', err);
        setError(err instanceof Error ? err.message : 'Failed to load venue map');
        setSvgContent(null);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    loadSVG();
  }, [venueName]);

  return { svgContent, sections, loading, error };
}
