// Maps FIFA World Cup team names to ISO 3166-1 alpha-2 codes for flag display
const COUNTRY_CODES: Record<string, string> = {
  // Group A
  'Morocco': 'ma',
  'USA': 'us',
  'United States': 'us',
  'Scotland': 'gb-sct',
  // Group B
  'Portugal': 'pt',
  'Spain': 'es',
  'Uruguay': 'uy',
  'Paraguay': 'py',
  // Group C
  'Argentina': 'ar',
  'Mexico': 'mx',
  'Peru': 'pe',
  'Uzbekistan': 'uz',
  // Group D
  'France': 'fr',
  'Colombia': 'co',
  'Denmark': 'dk',
  'UAE': 'ae',
  'United Arab Emirates': 'ae',
  // Group E
  'Brazil': 'br',
  'Ecuador': 'ec',
  'Cameroon': 'cm',
  'New Zealand': 'nz',
  // Group F
  'Netherlands': 'nl',
  'Hungary': 'hu',
  'Senegal': 'sn',
  'Indonesia': 'id',
  // Group G
  'Germany': 'de',
  'Croatia': 'hr',
  'Belgium': 'be',
  'Ukraine': 'ua',
  // Group H
  'England': 'gb-eng',
  'Poland': 'pl',
  'Iran': 'ir',
  'Panama': 'pa',
  // Group I
  'Japan': 'jp',
  'Australia': 'au',
  'Serbia': 'rs',
  'Bahrain': 'bh',
  // Group J
  'South Korea': 'kr',
  'Korea Republic': 'kr',
  'Saudi Arabia': 'sa',
  'Switzerland': 'ch',
  'Costa Rica': 'cr',
  // Group K
  'Italy': 'it',
  'Canada': 'ca',
  'Tunisia': 'tn',
  'Nigeria': 'ng',
  // Group L
  'Egypt': 'eg',
  'Ghana': 'gh',
  'Wales': 'gb-wls',
  'Chile': 'cl',
  'Qatar': 'qa',
  'Ivory Coast': 'ci',
  "Côte d'Ivoire": 'ci',
  'Algeria': 'dz',
  'Turkey': 'tr',
  'Czech Republic': 'cz',
  'Czechia': 'cz',
  'Sweden': 'se',
  'Norway': 'no',
  'Austria': 'at',
  'Romania': 'ro',
  'Bolivia': 'bo',
  'Venezuela': 've',
  'Honduras': 'hn',
  'El Salvador': 'sv',
  'Jamaica': 'jm',
  'Trinidad and Tobago': 'tt',
  'Guatemala': 'gt',
  'Curacao': 'cw',
  'Thailand': 'th',
  'China': 'cn',
  'India': 'in',
  'Russia': 'ru',
  'South Africa': 'za',
  'TBD': '',
};

// flagcdn.com only supports these specific widths
const SUPPORTED_WIDTHS = [20, 40, 80, 160, 320, 640, 1280, 2560];

function nearestSupportedWidth(desired: number): number {
  return SUPPORTED_WIDTHS.find(w => w >= desired) || SUPPORTED_WIDTHS[SUPPORTED_WIDTHS.length - 1];
}

/**
 * Get the flag image URL for a country/team name.
 * Uses flagcdn.com which serves flags as PNG images.
 */
export function getFlagUrl(teamName: string, size: number = 40): string {
  const code = COUNTRY_CODES[teamName?.trim()];
  if (!code) return '';
  const w = nearestSupportedWidth(size);
  return `https://flagcdn.com/w${w}/${code}.png`;
}

/**
 * Get the ISO country code for a team name
 */
export function getCountryCode(teamName: string): string {
  return COUNTRY_CODES[teamName?.trim()] || '';
}
