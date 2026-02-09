// Eagerly import all venue SVG maps as raw strings at build time
// This ensures they work on any hosting platform (no separate file serving needed)
const svgModules = import.meta.glob<string>('/public/venue-maps/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Build a lookup map: normalized name -> raw SVG content
const venueMapRegistry = new Map<string, string>();

for (const [path, content] of Object.entries(svgModules)) {
  // path looks like "/public/venue-maps/Gillette Stadium.svg"
  const filename = path.replace('/public/venue-maps/', '').replace('.svg', '');
  venueMapRegistry.set(filename, content);
}

console.log(`[VenueMapRegistry] Loaded ${venueMapRegistry.size} venue maps`);

export function getVenueMapSVG(name: string): string | null {
  return venueMapRegistry.get(name) ?? null;
}

export function hasVenueMap(name: string): boolean {
  return venueMapRegistry.has(name);
}

export default venueMapRegistry;
