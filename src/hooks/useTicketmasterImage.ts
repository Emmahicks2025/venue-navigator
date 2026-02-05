// Simple hook that returns the event's existing image (from Unsplash CDN mapping)
// The Ticketmaster direct API is disabled; images come from the performerImages map in eventsData.ts

// Default category images as final fallback
function getDefaultCategoryImage(category: string): string {
  const defaults: Record<string, string> = {
    concerts: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    theater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    comedy: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    festivals: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  };
  return defaults[category] || defaults.concerts;
}

// Hook to get performer image - uses the Unsplash CDN image already assigned to the event
export function useTicketmasterImage(
  performer: string,
  existingImage: string | undefined,
  category: string
): { imageUrl: string; isLoading: boolean } {
  // Simply return the existing image (from the performerImages map), or a category default
  const imageUrl = existingImage || getDefaultCategoryImage(category);
  return { imageUrl, isLoading: false };
}
