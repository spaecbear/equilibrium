/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Equilibrium color palette – HUD-like minimal design
const BASE_DARK = '#0A0A0E';
const TEXT_PRIMARY = '#EFEFF4';
const TEXT_SECONDARY = '#343441';
const ACCENT_AMBER = '#F2B870';
const ACCENT_AMBER_DIM = '#3A2E1A';

// Functional colors
const COLOR_POSITIVE = '#4CAF50'; // green for gains/positive
const COLOR_NEGATIVE = '#F44336'; // red for losses/negative

export const Colors = {
  light: {
    text: TEXT_PRIMARY,
    background: BASE_DARK,
    backgroundElement: '#1A1A1F',
    backgroundSelected: ACCENT_AMBER_DIM,
    textSecondary: TEXT_SECONDARY,
    accent: ACCENT_AMBER,
    accentDim: ACCENT_AMBER_DIM,
    positive: COLOR_POSITIVE,
    negative: COLOR_NEGATIVE,
  },
  dark: {
    text: TEXT_PRIMARY,
    background: BASE_DARK,
    backgroundElement: '#1A1A1F',
    backgroundSelected: ACCENT_AMBER_DIM,
    textSecondary: TEXT_SECONDARY,
    accent: ACCENT_AMBER,
    accentDim: ACCENT_AMBER_DIM,
    positive: COLOR_POSITIVE,
    negative: COLOR_NEGATIVE,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Preset deck colors – users can pick from these
export const DeckColorPresets = [
  { name: 'Amber', hex: '#F2B870' },
  { name: 'Slate', hex: '#8B92A0' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Ocean', hex: '#4A90E2' },
  { name: 'Plum', hex: '#9B59B6' },
  { name: 'Sage', hex: '#7FB069' },
  { name: 'Steel', hex: '#5A6C7D' },
] as const;

export type DeckColor = typeof DeckColorPresets[number]['hex'];

// Preset deck icons
export const DeckIconPresets = [
  'wallet',
  'briefcase',
  'building',
  'cash',
  'credit-card',
  'dollar-sign',
  'house',
  'trending-up',
  'shopping-cart',
  'gift',
  'archive',
  'box',
] as const;

export type DeckIcon = typeof DeckIconPresets[number];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
