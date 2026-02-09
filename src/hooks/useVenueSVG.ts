import { useState, useEffect } from 'react';
import { SVGSection, parseSVGSections } from '@/lib/svgParser';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const FALLBACK_MAP = '_general';

interface UseVenueSVGResult {
  svgContent: string | null;
  sections: SVGSection[];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

function normalizeVenueName(name: string): string {
  return name.replace(/&/g, '');
}

// In-memory cache
const svgCache = new Map<string, { content: string; sections: SVGSection[] }>();

async function fetchSVGFromFirestore(name: string): Promise<{ content: string; sections: SVGSection[] }> {
  const normalizedName = normalizeVenueName(name);

  if (svgCache.has(normalizedName)) {
    return svgCache.get(normalizedName)!;
  }

  console.log(`[VenueSVG] Trying Firestore: "${normalizedName}"`);

  const snapshot = await getDocs(
    query(collection(db, 'venue_maps'), where('venue_name', '==', normalizedName))
  );

  if (!snapshot.empty) {
    const content = snapshot.docs[0].data().svg_content as string;
    if (content && content.includes('<svg')) {
      const sections = parseSVGSections(content);
      const result = { content, sections };
      svgCache.set(normalizedName, result);
      return result;
    }
  }

  // Fallback: try fetching from static /venue-maps/ (works in dev)
  console.log(`[VenueSVG] Firestore miss, trying static file: "${normalizedName}"`);
  const url = `/venue-maps/${encodeURIComponent(normalizedName)}.svg`;
  const response = await fetch(url);

  if (response.ok) {
    const content = await response.text();
    if (content.includes('<svg') || content.includes('<?xml')) {
      const sections = parseSVGSections(content);
      const result = { content, sections };
      svgCache.set(normalizedName, result);
      return result;
    }
  }

  throw new Error(`Venue map not found: ${normalizedName}`);
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
        const result = await fetchSVGFromFirestore(venueName);
        if (result.sections.length === 0) throw new Error('Map has no interactive sections');
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
          const fallback = await fetchSVGFromFirestore(FALLBACK_MAP);
          setSvgContent(fallback.content);
          setSections(fallback.sections);
          setIsFallback(true);
        } catch {
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
