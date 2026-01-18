// Brand Guidelines and Assets Library
// This file contains all brand definitions for consistent usage across the platform

export const brandColors = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  // Secondary palette (Success/Growth)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  // Accent palette (Warm/Action)
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  // Neutral palette
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.16' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  section: {
    sm: '3rem', // 48px
    md: '5rem', // 80px
    lg: '7rem', // 112px
  },
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
};

export const shadows = {
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  softLg: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
  softXl: '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
  glow: '0 0 40px rgba(14, 165, 233, 0.15)',
};

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const brandVoice = {
  tone: [
    'Friendly and approachable',
    'Professional but not corporate',
    'Helpful and supportive',
    'Clear and concise',
    'Empowering and encouraging',
  ],
  doSay: [
    'Simplifique sua gestão',
    'Transforme seu negócio',
    'Cresça com confiança',
    'Economize tempo',
    'Aumente sua receita',
  ],
  dontSay: [
    'Avoid jargon and technical terms',
    'Dont be condescending',
    'Avoid negative language',
    'Dont overpromise',
  ],
};

export const logoUsage = {
  minSize: {
    horizontal: '120px',
    icon: '32px',
  },
  clearSpace: 'Equal to the height of the P in Puncto',
  backgrounds: {
    light: 'Use primary logo on white or light backgrounds',
    dark: 'Use white logo on dark or colored backgrounds',
    colored: 'Use white logo on primary/secondary colors',
  },
  donts: [
    'Dont stretch or distort the logo',
    'Dont change logo colors',
    'Dont add effects (shadows, gradients)',
    'Dont place on busy backgrounds',
    'Dont rotate the logo',
  ],
};

export const brandAssets = {
  logos: {
    primary: '/brand/logo-primary.svg',
    white: '/brand/logo-white.svg',
    icon: '/brand/logo-icon.svg',
    iconWhite: '/brand/logo-icon-white.svg',
  },
  socialMedia: {
    facebook: '/brand/social/facebook.png',
    instagram: '/brand/social/instagram.png',
    linkedin: '/brand/social/linkedin.png',
    twitter: '/brand/social/twitter.png',
  },
  patterns: {
    dots: '/brand/patterns/dots.svg',
    grid: '/brand/patterns/grid.svg',
    waves: '/brand/patterns/waves.svg',
  },
  illustrations: {
    scheduling: '/brand/illustrations/scheduling.svg',
    payments: '/brand/illustrations/payments.svg',
    analytics: '/brand/illustrations/analytics.svg',
    team: '/brand/illustrations/team.svg',
    restaurant: '/brand/illustrations/restaurant.svg',
  },
};

// CSS Variables for runtime theming
export const cssVariables = `
  :root {
    --color-primary-50: ${brandColors.primary[50]};
    --color-primary-100: ${brandColors.primary[100]};
    --color-primary-200: ${brandColors.primary[200]};
    --color-primary-300: ${brandColors.primary[300]};
    --color-primary-400: ${brandColors.primary[400]};
    --color-primary-500: ${brandColors.primary[500]};
    --color-primary-600: ${brandColors.primary[600]};
    --color-primary-700: ${brandColors.primary[700]};
    --color-primary-800: ${brandColors.primary[800]};
    --color-primary-900: ${brandColors.primary[900]};
    
    --color-secondary-50: ${brandColors.secondary[50]};
    --color-secondary-100: ${brandColors.secondary[100]};
    --color-secondary-200: ${brandColors.secondary[200]};
    --color-secondary-300: ${brandColors.secondary[300]};
    --color-secondary-400: ${brandColors.secondary[400]};
    --color-secondary-500: ${brandColors.secondary[500]};
    --color-secondary-600: ${brandColors.secondary[600]};
    --color-secondary-700: ${brandColors.secondary[700]};
    --color-secondary-800: ${brandColors.secondary[800]};
    --color-secondary-900: ${brandColors.secondary[900]};
    
    --color-accent-50: ${brandColors.accent[50]};
    --color-accent-100: ${brandColors.accent[100]};
    --color-accent-200: ${brandColors.accent[200]};
    --color-accent-300: ${brandColors.accent[300]};
    --color-accent-400: ${brandColors.accent[400]};
    --color-accent-500: ${brandColors.accent[500]};
    --color-accent-600: ${brandColors.accent[600]};
    --color-accent-700: ${brandColors.accent[700]};
    --color-accent-800: ${brandColors.accent[800]};
    --color-accent-900: ${brandColors.accent[900]};
    
    --shadow-soft: ${shadows.soft};
    --shadow-soft-lg: ${shadows.softLg};
    --shadow-soft-xl: ${shadows.softXl};
    --shadow-glow: ${shadows.glow};
    
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-2xl: ${borderRadius['2xl']};
  }
`;
