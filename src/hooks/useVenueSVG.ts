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

// Normalize venue name for lookup
function normalizeVenueName(name: string): string {
  return name.replace(/&/g, '');
}

// In-memory cache to avoid repeated Firestore reads
const svgCache = new Map<string, { content: string; sections: SVGSection[] }>();

async function fetchSVGFromFirestore(name: string): Promise<{ content: string; sections: SVGSection[] }> {
  const normalizedName = normalizeVenueName(name);
  
  // Check cache first
  if (svgCache.has(normalizedName)) {
    console.log(`[VenueSVG] Cache hit: "${normalizedName}"`);
    return svgCache.get(normalizedName)!;
  }

  console.log(`[VenueSVG] Fetching from Firestore: "${normalizedName}" (original: "${name}")`);
  
  const venueRef = collection(db, 'venue_maps');
  const q = query(venueRef, where('venue_name', '==', normalizedName));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error(`Venue map not found in Firestore: ${normalizedName}`);
  }

  const doc = snapshot.docs[0];
  const content = doc.data().svg_content as string;

  if (!content || !content.includes('<svg')) {
    throw new Error(`Invalid SVG content for venue: ${normalizedName}`);
  }

  const sections = parseSVGSections(content);
  const result = { content, sections };
  
  // Cache the result
  svgCache.set(normalizedName, result);
  
  return result;
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
          const fallback = await fetchSVGFromFirestore(FALLBACK_MAP);
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
