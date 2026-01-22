import { memo } from 'react';
import type { ThemeColors } from '../types/theme';
import { constellationPoints, constellationLines, starsData } from '../data/constellations';

interface CosmicBackgroundProps {
    c: ThemeColors;
    isDark: boolean;
}

export const CosmicBackground = memo(({ c, isDark }: CosmicBackgroundProps) => (
    <div className="cosmic-bg">
        {/* Stars - only in dark mode */}
        <div className={`stars-layer ${isDark ? 'visible' : 'hidden'}`}>
            {starsData.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}
        </div>

        {/* Constellations - visible in BOTH modes */}
        <svg className="constellations" viewBox="0 0 100 100" preserveAspectRatio="none">
            {constellationLines.map(([a, b], i) => (
                <line
                    key={i}
                    x1={constellationPoints[a].x}
                    y1={constellationPoints[a].y}
                    x2={constellationPoints[b].x}
                    y2={constellationPoints[b].y}
                    stroke={c.constellationLine}
                    strokeWidth="0.15"
                />
            ))}
            {constellationPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="0.3" fill={c.constellationPoint} />
            ))}
        </svg>

        {/* Orbital rings - visible in both, blue color */}
        <div className="orbital-ring ring-1" style={{ borderColor: c.earthGlow }} />
        <div className="orbital-ring ring-2" style={{ borderColor: c.earthGlow }} />
        <div className="orbital-ring ring-3" style={{ borderColor: c.earthGlow }} />
    </div>
));

CosmicBackground.displayName = 'CosmicBackground';
