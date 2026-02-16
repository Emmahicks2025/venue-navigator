import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SVGSection } from '@/lib/svgParser';

export interface EventSectionPricing {
  event_id: string;
  section_id: string;
  price_min: number;
  price_max: number;
  current_price: number;
  available: boolean;
}

/**
 * Fetch per-event section pricing overrides from Firestore.
 * Returns a Map keyed by section_id.
 */
export async function fetchEventPricingOverrides(eventId: string): Promise<Map<string, EventSectionPricing>> {
  const map = new Map<string, EventSectionPricing>();
  try {
    const snapshot = await getDocs(
      query(collection(db, 'event_section_pricing'), where('event_id', '==', eventId))
    );
    snapshot.docs.forEach(d => {
      const data = d.data() as EventSectionPricing;
      map.set(data.section_id, data);
    });
  } catch (err) {
    console.warn('[EventPricing] Failed to fetch overrides:', err);
  }
  return map;
}

/**
 * Apply per-event pricing overrides on top of SVG-derived sections.
 * SVG sections are the base/default; overrides take priority when they exist.
 */
export function applySectionOverrides(
  svgSections: SVGSection[],
  overrides: Map<string, EventSectionPricing>
): SVGSection[] {
  if (overrides.size === 0) return svgSections;

  return svgSections.map(section => {
    const override = overrides.get(section.id);
    if (!override) return section;

    return {
      ...section,
      priceMin: override.price_min,
      priceMax: override.price_max,
      currentPrice: override.current_price,
      available: override.available,
    };
  });
}

/**
 * Save per-event pricing overrides to Firestore.
 * Uses composite doc IDs: `${eventId}_${sectionId}` for upsert behavior.
 */
export async function saveEventPricingOverrides(
  eventId: string,
  sections: Array<{
    section_id: string;
    price_min: number;
    price_max: number;
    current_price: number;
    available: boolean;
  }>
): Promise<void> {
  const promises = sections.map(section => {
    const docId = `${eventId}_${section.section_id}`;
    return setDoc(doc(db, 'event_section_pricing', docId), {
      event_id: eventId,
      section_id: section.section_id,
      price_min: section.price_min,
      price_max: section.price_max,
      current_price: section.current_price,
      available: section.available,
    });
  });
  await Promise.all(promises);
}

/**
 * Generate per-section pricing based on event-level min/max prices,
 * scaling proportionally from SVG base prices.
 */
export function generateSectionPricesFromEventRange(
  svgSections: SVGSection[],
  eventMinPrice: number,
  eventMaxPrice: number
): Array<{
  section_id: string;
  price_min: number;
  price_max: number;
  current_price: number;
  available: boolean;
}> {
  if (svgSections.length === 0) return [];

  // Find the SVG's overall price range
  const svgMinPrice = Math.min(...svgSections.map(s => s.priceMin));
  const svgMaxPrice = Math.max(...svgSections.map(s => s.priceMax));
  const svgRange = svgMaxPrice - svgMinPrice || 1;
  const eventRange = eventMaxPrice - eventMinPrice || 1;

  return svgSections.map(section => {
    // Scale proportionally: where this section sits in the SVG price range
    const minRatio = (section.priceMin - svgMinPrice) / svgRange;
    const maxRatio = (section.priceMax - svgMinPrice) / svgRange;
    const currentRatio = (section.currentPrice - svgMinPrice) / svgRange;

    return {
      section_id: section.id,
      price_min: Math.round(eventMinPrice + minRatio * eventRange),
      price_max: Math.round(eventMinPrice + maxRatio * eventRange),
      current_price: Math.round(eventMinPrice + currentRatio * eventRange),
      available: section.available,
    };
  });
}

/**
 * React hook: load event-specific pricing overrides.
 */
export function useEventPricing(eventId: string | undefined) {
  const [overrides, setOverrides] = useState<Map<string, EventSectionPricing>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchEventPricingOverrides(eventId)
      .then(setOverrides)
      .finally(() => setLoading(false));
  }, [eventId]);

  return { overrides, loading };
}
