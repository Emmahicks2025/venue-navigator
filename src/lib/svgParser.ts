// SVG Parser utility to extract section data from venue SVG maps

export interface SVGSection {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
  priceMin: number;
  priceMax: number;
  currentPrice: number;
  available: boolean;
}

export interface ParsedVenue {
  name: string;
  sections: SVGSection[];
  svgContent: string;
}

// Parse section data from SVG content
export function parseSVGSections(svgContent: string): SVGSection[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  
  const sections: SVGSection[] = [];
  const sectionElements = doc.querySelectorAll('g[data-section-id]');
  
  sectionElements.forEach((el) => {
    const sectionId = el.getAttribute('data-section-id') || '';
    const rows = parseInt(el.getAttribute('data-rows') || '10', 10);
    const seatsPerRow = parseInt(el.getAttribute('data-seats-per-row') || '20', 10);
    const totalSeats = parseInt(el.getAttribute('data-total-seats') || String(rows * seatsPerRow), 10);
    const priceMin = parseFloat(el.getAttribute('data-price-min') || '50');
    const priceMax = parseFloat(el.getAttribute('data-price-max') || '200');
    const currentPrice = parseFloat(el.getAttribute('data-current-price') || '100');
    const available = el.getAttribute('data-available') !== 'false';
    
    // Get section name from title element or generate from ID
    const titleEl = el.querySelector('title');
    let name = sectionId;
    if (titleEl && titleEl.textContent) {
      const titleMatch = titleEl.textContent.match(/Section\s+([^\|]+)/);
      name = titleMatch ? titleMatch[1].trim() : sectionId;
    }
    
    sections.push({
      id: sectionId,
      name: formatSectionName(name),
      rows,
      seatsPerRow,
      totalSeats,
      priceMin,
      priceMax,
      currentPrice,
      available,
    });
  });
  
  return sections;
}

// Format section name for display
function formatSectionName(name: string): string {
  // Handle common patterns
  if (name.match(/^\d+$/)) {
    return `Section ${name}`;
  }
  if (name.toLowerCase().includes('floor')) {
    return 'Floor';
  }
  if (name.toLowerCase().includes('vip')) {
    return 'VIP';
  }
  if (name.toLowerCase().includes('suite')) {
    return name.replace(/[-_]/g, ' ').split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join(' ');
  }
  return name.toUpperCase();
}

// Get price category based on price
export function getPriceCategory(price: number, minPrice: number, maxPrice: number): 'premium' | 'standard' | 'value' {
  const range = maxPrice - minPrice;
  const threshold1 = minPrice + range * 0.33;
  const threshold2 = minPrice + range * 0.66;
  
  if (price >= threshold2) return 'premium';
  if (price >= threshold1) return 'standard';
  return 'value';
}

// Convert SVG sections to venue sections format
export function convertToVenueSections(svgSections: SVGSection[]) {
  // Find min and max prices across all sections
  const allPrices = svgSections.map(s => s.currentPrice);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  
  return svgSections.map(section => ({
    id: section.id,
    name: section.name,
    rows: section.rows,
    seatsPerRow: section.seatsPerRow,
    priceCategory: getPriceCategory(section.currentPrice, minPrice, maxPrice),
    basePrice: section.currentPrice,
  }));
}

// Load and parse SVG from URL
export async function loadVenueSVG(venueName: string): Promise<{ svgContent: string; sections: SVGSection[] } | null> {
  try {
    const safeName = encodeURIComponent(venueName);
    const response = await fetch(`/venue-maps/${safeName}.svg`);
    if (!response.ok) return null;

    const svgContent = await response.text();
    const sections = parseSVGSections(svgContent);

    return { svgContent, sections };
  } catch (error) {
    console.error(`Failed to load SVG for ${venueName}:`, error);
    return null;
  }
}
