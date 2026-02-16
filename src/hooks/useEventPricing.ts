import { SVGSection } from '@/lib/svgParser';

/**
 * Compute a desirability score (0–1) for a section based on its name/ID.
 * Closer to stage/pitch/floor → higher score → more expensive.
 */
function getSectionDesirability(section: SVGSection): number {
  const name = (section.name + ' ' + section.id).toLowerCase();

  if (/\b(floor|field|pit|vip|club|premium|courtside|ringside|platinum)\b/.test(name)) return 0.95 + Math.random() * 0.05;
  if (/\b(suite|box|lounge|loge)\b/.test(name)) return 0.85 + Math.random() * 0.1;

  const levelMatch = name.match(/\b(?:level|tier)\s*(\d)/);
  if (levelMatch) {
    const level = parseInt(levelMatch[1]);
    if (level === 1) return 0.75 + Math.random() * 0.15;
    if (level === 2) return 0.45 + Math.random() * 0.15;
    return 0.15 + Math.random() * 0.15;
  }

  const secNum = name.match(/(?:section\s*)?(\d+)/);
  if (secNum) {
    const num = parseInt(secNum[1]);
    if (num <= 50) return 0.70 + Math.random() * 0.15;
    if (num <= 120) return 0.55 + Math.random() * 0.15;
    if (num <= 200) return 0.40 + Math.random() * 0.15;
    if (num <= 300) return 0.25 + Math.random() * 0.15;
    if (num <= 400) return 0.15 + Math.random() * 0.1;
    return 0.05 + Math.random() * 0.1;
  }

  if (/\b(balcony|upper|gallery|nosebleed|rear)\b/.test(name)) return 0.15 + Math.random() * 0.15;
  if (/\b(mezzanine|terrace|middle)\b/.test(name)) return 0.40 + Math.random() * 0.15;
  if (/\b(lower|orchestra|front|center|centre)\b/.test(name)) return 0.70 + Math.random() * 0.15;

  return 0.40 + Math.random() * 0.2;
}

/**
 * Generate per-section pricing from event-level min/max using smart heuristics.
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

  const scored = svgSections.map(section => ({
    section,
    score: getSectionDesirability(section),
  }));

  const minScore = Math.min(...scored.map(s => s.score));
  const maxScore = Math.max(...scored.map(s => s.score));
  const scoreRange = maxScore - minScore || 1;

  return scored.map(({ section, score }) => {
    const normalizedScore = (score - minScore) / scoreRange;
    const spreadFactor = 0.08 + Math.random() * 0.07;
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
 * Bake pricing data into SVG content by updating data attributes on section <g> elements.
 * Returns a new SVG string with prices embedded.
 */
export function bakePricingIntoSVG(
  svgContent: string,
  sectionPrices: Array<{
    section_id: string;
    price_min: number;
    price_max: number;
    current_price: number;
    available: boolean;
  }>
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');

  const priceMap = new Map(sectionPrices.map(p => [p.section_id, p]));

  const sectionElements = doc.querySelectorAll('g[data-section-id]');
  sectionElements.forEach(el => {
    const id = el.getAttribute('data-section-id');
    if (!id) return;
    const pricing = priceMap.get(id);
    if (!pricing) return;

    el.setAttribute('data-price-min', String(pricing.price_min));
    el.setAttribute('data-price-max', String(pricing.price_max));
    el.setAttribute('data-current-price', String(pricing.current_price));
    el.setAttribute('data-available', pricing.available ? 'true' : 'false');
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
