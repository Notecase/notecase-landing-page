import type { Themes } from '../types/theme';

// Theme palette - with constellation colors for both modes
export const themes: Themes = {
    dark: {
        void: '#0a0a0a',
        nebula: '#111111',
        dust: '#1a1a1a',
        cosmos: '#141414',
        starlight: '#ffffff',
        moonlight: '#a0a0a0',
        distant: '#666666',
        border: '#2a2a2a',
        borderLight: '#333333',
        solarFlare: '#f59e0b',
        solarFlareAlt: '#fbbf24',
        earthGlow: '#3b82f6',
        success: '#22c55e',
        constellationLine: 'rgba(255,255,255,0.08)',
        constellationPoint: 'rgba(255,255,255,0.25)',
    },
    light: {
        void: '#fafafa',
        nebula: '#f5f5f5',
        dust: '#eeeeee',
        cosmos: '#e8e8e8',
        starlight: '#0a0a0a',
        moonlight: '#555555',
        distant: '#888888',
        border: '#d4d4d4',
        borderLight: '#e0e0e0',
        solarFlare: '#d97706',
        solarFlareAlt: '#b45309',
        earthGlow: '#2563eb',
        success: '#16a34a',
        constellationLine: 'rgba(0,0,0,0.08)',
        constellationPoint: 'rgba(0,0,0,0.2)',
    }
};
