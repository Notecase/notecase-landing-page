// Theme type definitions for Notecase landing page

export interface ThemeColors {
  void: string;
  nebula: string;
  dust: string;
  cosmos: string;
  starlight: string;
  moonlight: string;
  distant: string;
  border: string;
  borderLight: string;
  solarFlare: string;
  solarFlareAlt: string;
  earthGlow: string;
  success: string;
  constellationLine: string;
  constellationPoint: string;
}

export type ThemeMode = 'dark' | 'light';

export interface Themes {
  dark: ThemeColors;
  light: ThemeColors;
}

export interface LayoutContext {
  c: ThemeColors;
  isDark: boolean;
}
