export const APP_NAME = 'BETORA';
export const APP_VERSION = '1.0.0';

export const BETORA_BRAND = {
  name: 'BETORA',
  tagline: 'Play the Game. Own the Moment.',
  url: 'https://betora.com',
  supportEmail: 'support@betora.com',
  colors: {
    primary: '#FF6B2B', primaryDark: '#E55A1F', primaryLight: '#FF8C5A',
    secondary: '#1A1A2E', secondaryLight: '#242442',
    accent: '#00D4AA', accentLight: '#33DFBE',
    background: '#0F0F1A', surface: '#1A1A2E', surfaceLight: '#242442',
    text: '#FFFFFF', textSecondary: '#A0A0B8', textMuted: '#6B6B80',
    success: '#00D4AA', warning: '#FFB800', error: '#FF4444', info: '#4488FF',
    border: '#2A2A45', borderLight: '#363655',
  },
};

export const SPORTS = [
  { id: 'football', name: 'Football', icon: '⚽', slug: 'football' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', slug: 'basketball' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', slug: 'tennis' },
  { id: 'esports', name: 'Esports', icon: '🎮', slug: 'esports' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', slug: 'cricket' },
  { id: 'rugby', name: 'Rugby', icon: '🏉', slug: 'rugby' },
  { id: 'boxing', name: 'Boxing', icon: '🥊', slug: 'boxing' },
  { id: 'mma', name: 'MMA', icon: '🤼', slug: 'mma' },
  { id: 'ice-hockey', name: 'Ice Hockey', icon: '🏒', slug: 'ice-hockey' },
  { id: 'baseball', name: 'Baseball', icon: '⚾', slug: 'baseball' },
];

export const STAKE_LIMITS = { MIN_STAKE: 0.50, MAX_STAKE: 100000, DEFAULT_STAKE: 10 };
export const PAGINATION = { DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100 };
