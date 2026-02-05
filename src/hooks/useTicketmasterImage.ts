import { useState, useEffect } from 'react';

const TICKETMASTER_API_KEY = 'OFsfv5aibhR5AiIYAGsFCUPd6Ef8AR9A';
const DISCOVERY_API_URL = 'https://app.ticketmaster.com/discovery/v2';

// Cache to avoid repeated API calls for the same performer
const imageCache: Record<string, string | null> = {};

interface TicketmasterImage {
  url: string;
  width: number;
  height: number;
  ratio?: string;
}

interface TicketmasterAttraction {
  name: string;
  images?: TicketmasterImage[];
}

interface TicketmasterResponse {
  _embedded?: {
    attractions?: TicketmasterAttraction[];
    events?: Array<{
      name: string;
      images?: TicketmasterImage[];
    }>;
  };
}

// Get the best quality image from Ticketmaster response
function getBestImage(images: TicketmasterImage[]): string | null {
  if (!images || images.length === 0) return null;
  
  // Prefer 16:9 ratio images with larger dimensions
  const preferred = images
    .filter(img => img.ratio === '16_9' || img.ratio === '3_2')
    .sort((a, b) => (b.width || 0) - (a.width || 0));
  
  if (preferred.length > 0) {
    return preferred[0].url;
  }
  
  // Fallback to largest image
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || null;
}

// Fetch image from Ticketmaster API
async function fetchTicketmasterImage(searchTerm: string): Promise<string | null> {
  // Check cache first
  const cacheKey = searchTerm.toLowerCase().trim();
  if (cacheKey in imageCache) {
    return imageCache[cacheKey];
  }

  try {
    // First try searching for attractions (artists, teams, etc.)
    const attractionUrl = `${DISCOVERY_API_URL}/attractions.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(searchTerm)}&size=1`;
    const attractionResponse = await fetch(attractionUrl);
    
    if (attractionResponse.ok) {
      const data: TicketmasterResponse = await attractionResponse.json();
      const attraction = data._embedded?.attractions?.[0];
      
      if (attraction?.images) {
        const imageUrl = getBestImage(attraction.images);
        if (imageUrl) {
          imageCache[cacheKey] = imageUrl;
          return imageUrl;
        }
      }
    }

    // If no attraction found, try searching events
    const eventUrl = `${DISCOVERY_API_URL}/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(searchTerm)}&size=1`;
    const eventResponse = await fetch(eventUrl);
    
    if (eventResponse.ok) {
      const data: TicketmasterResponse = await eventResponse.json();
      const event = data._embedded?.events?.[0];
      
      if (event?.images) {
        const imageUrl = getBestImage(event.images);
        if (imageUrl) {
          imageCache[cacheKey] = imageUrl;
          return imageUrl;
        }
      }
    }

    // No image found
    imageCache[cacheKey] = null;
    return null;
  } catch (error) {
    console.error('Error fetching Ticketmaster image:', error);
    imageCache[cacheKey] = null;
    return null;
  }
}

// Hook to get performer image - uses static images for fast loading
// API fetching is disabled for performance - images are pre-mapped
export function useTicketmasterImage(
  performer: string,
  existingImage: string | undefined,
  category: string
): { imageUrl: string; isLoading: boolean } {
  // Use the existing image directly - no API calls for better performance
  const imageUrl = existingImage || getDefaultCategoryImage(category);
  return { imageUrl, isLoading: false };
}

// Batch fetch images for multiple performers
export async function fetchMultipleImages(
  performers: string[]
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};
  
  // Deduplicate and filter
  const uniquePerformers = [...new Set(performers.map(p => p.toLowerCase().trim()))];
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < uniquePerformers.length; i += batchSize) {
    const batch = uniquePerformers.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (performer) => {
        results[performer] = await fetchTicketmasterImage(performer);
      })
    );
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < uniquePerformers.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}

// Default category images as final fallback
function getDefaultCategoryImage(category: string): string {
  const defaults: Record<string, string> = {
    concerts: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    sports: 'https://images.unsplash.com/photo-1461896836934- voices8b2357?w=800',
    theater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    comedy: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    festivals: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  };
  return defaults[category] || defaults.concerts;
}

// Export the fetch function for use in data enrichment
export { fetchTicketmasterImage };
