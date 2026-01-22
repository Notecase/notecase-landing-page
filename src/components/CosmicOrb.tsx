import { memo } from 'react';

interface CosmicOrbProps {
    size?: number;
    x?: number;
    y?: number;
    isDark: boolean;
    accent?: boolean;
}

export const CosmicOrb = memo(({ size = 400, x = 50, y = 50, isDark, accent = false }: CosmicOrbProps) => (
    <div
        className={`cosmic-orb ${accent ? 'accent' : ''}`}
        style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            background: accent
                ? `radial-gradient(circle, ${isDark ? 'rgba(245,158,11,0.06)' : 'rgba(217,119,6,0.04)'} 0%, transparent 70%)`
                : `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)'} 0%, transparent 70%)`
        }}
    />
));

CosmicOrb.displayName = 'CosmicOrb';
