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
 * Compute a desirability score (0–1) for a section based on its name/ID.
 * Closer to stage/pitch/floor → higher score → more expensive.
 */
function getSectionDesirability(section: SVGSection): number {
  const name = (section.name + ' ' + section.id).toLowerCase();

  // Premium keywords → top tier
  if (/\b(floor|field|pit|vip|club|premium|courtside|ringside|platinum)\b/.test(name)) return 0.95 + Math.random() * 0.05;
  if (/\b(suite|box|lounge|loge)\b/.test(name)) return 0.85 + Math.random() * 0.1;

  // Try to extract a numeric level/section number
  const levelMatch = name.match(/\b(?:level|tier)\s*(\d)/);
  if (levelMatch) {
    const level = parseInt(levelMatch[1]);
    if (level === 1) return 0.75 + Math.random() * 0.15;
    if (level === 2) return 0.45 + Math.random() * 0.15;
    return 0.15 + Math.random() * 0.15; // level 3+
  }

  // Section numbers: lower = closer = more expensive
  const secNum = name.match(/(?:section\s*)?(\d+)/);
  if (secNum) {
    const num = parseInt(secNum[1]);
    if (num <= 50) return 0.70 + Math.random() * 0.15;
    if (num <= 120) return 0.55 + Math.random() * 0.15;
    if (num <= 200) return 0.40 + Math.random() * 0.15;
    if (num <= 300) return 0.25 + Math.random() * 0.15;
    if (num <= 400) return 0.15 + Math.random() * 0.1;
    return 0.05 + Math.random() * 0.1; // 500+
  }

  // Balcony / upper / nosebleed → cheap
  if (/\b(balcony|upper|gallery|nosebleed|rear)\b/.test(name)) return 0.15 + Math.random() * 0.15;
  if (/\b(mezzanine|terrace|middle)\b/.test(name)) return 0.40 + Math.random() * 0.15;
  if (/\b(lower|orchestra|front|center|centre)\b/.test(name)) return 0.70 + Math.random() * 0.15;

  // Fallback: use SVG base price ratio as hint
  return 0.40 + Math.random() * 0.2;
}

/**
 * Generate per-section pricing based on event-level min/max prices.
 * Uses smart heuristics: sections closer to stage/pitch are priced higher,
 * with slight randomness for natural variation.
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

  const eventRange = eventMaxPrice - eventMinPrice || 1;

  // Score each section
  const scored = svgSections.map(section => ({
    section,
    score: getSectionDesirability(section),
  }));

  // Normalize scores to 0–1 range across all sections
  const minScore = Math.min(...scored.map(s => s.score));
  const maxScore = Math.max(...scored.map(s => s.score));
  const scoreRange = maxScore - minScore || 1;

  return scored.map(({ section, score }) => {
    const normalizedScore = (score - minScore) / scoreRange;

    // Add a small spread for min/max around the current price
    const spreadFactor = 0.08 + Math.random() * 0.07; // 8-15% spread
    const basePrice = eventMinPrice + normalizedScore * eventRange;
    const priceMin = Math.round(Math.max(eventMinPrice, basePrice * (1 - spreadFactor)));
    const priceMax = Math.round(Math.min(eventMaxPrice, basePrice * (1 + spreadFactor)));
    const currentPrice = Math.round(basePrice);

    return {
      section_id: section.id,
      price_min: priceMin,
      price_max: priceMax,
      current_price: currentPrice,
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
