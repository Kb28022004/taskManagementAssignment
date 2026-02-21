export const theme = {
  colors: {
    // Primary: Indigo/Violet Gradient base
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4338ca',
    
    // Secondary: Emerald/Green
    secondary: '#10b981',
    secondaryLight: '#34d399',
    
    // Accents
    accent: '#f43f5e', // Rose
    violet: '#8b5cf6',
    amber: '#f59e0b',
    
    // UI Colors
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceDark: '#f1f5f9',
    
    white: '#ffffff',
    black: '#000000',
    
    // Text
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    
    // Status
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Special
    glass: 'rgba(255, 255, 255, 0.7)',
    glassDark: 'rgba(15, 23, 42, 0.05)',
    border: '#e2e8f0',
    cardShadow: 'rgba(99, 102, 241, 0.15)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  typography: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    h1: {
      fontSize: 34,
      fontWeight: '800',
      letterSpacing: -1,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    caption: {
      fontSize: 13,
      fontWeight: '600',
      color: '#64748b',
    },
  }
};

import { Platform } from 'react-native';
