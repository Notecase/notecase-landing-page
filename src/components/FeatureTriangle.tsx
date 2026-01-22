import { memo, useState } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface FeatureTriangleProps {
    c: ThemeColors;
    isDark: boolean;
}

const features = [
    {
        label: 'Research', icon: '◎',
        title: 'Deep research synthesis',
        description: 'Researches across your sources and the web. Synthesizes findings into structured knowledge.',
        capabilities: ['Source cross-referencing', 'Citation tracking', 'Knowledge graphs'],
    },
    {
        label: 'Recommend', icon: '◈',
        title: 'Intelligent recommendations',
        description: 'Recommends the next best video, article, or course based on your goal.',
        capabilities: ['Personalized paths', 'Gap detection', 'Progress tracking'],
    },
    {
        label: 'Generate', icon: '◇',
        title: 'Study tool generation',
        description: 'Generates flashcards, quizzes, summaries, and mind maps automatically.',
        capabilities: ['Auto flashcards', 'Practice tests', 'Visual summaries'],
    },
];

export const FeatureTriangle = memo(({ c, isDark }: FeatureTriangleProps) => {
    const [activeFeature, setActiveFeature] = useState(0);

    const triangleSize = 280;
    const centerX = triangleSize / 2;
    const centerY = triangleSize / 2;
    const radius = triangleSize / 2 - 45;

    const getPosition = (index: number) => {
        const angle = (index * 120 - 90) * (Math.PI / 180);
        return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
    };

    return (
        <section id="features" className="features-section">
            <CosmicOrb size={500} x={10} y={60} isDark={isDark} />

            <div className="container">
                <div className="section-header">
                    <span className="section-tag" style={{ color: c.solarFlare }}>◉ AGENT CAPABILITIES</span>
                    <h2 style={{ color: c.starlight }}>Three pillars of learning</h2>
                    <p style={{ color: c.moonlight }}>A true agent companion that helps you explore, understand, and retain.</p>
                </div>

                <div className="triangle-layout">
                    <div className="triangle-nav" style={{ width: triangleSize, height: triangleSize }}>
                        <svg className="triangle-svg" width={triangleSize} height={triangleSize}>
                            <circle cx={centerX} cy={centerY} r={radius + 15} fill="none" stroke={c.border} strokeWidth="1" strokeDasharray="4 8" />
                            {features.map((_, i) => {
                                const pos1 = getPosition(i);
                                const pos2 = getPosition((i + 1) % 3);
                                return <line key={i} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} stroke={c.border} strokeWidth="1" />;
                            })}
                            <line x1={centerX} y1={centerY} x2={getPosition(activeFeature).x} y2={getPosition(activeFeature).y} stroke={c.solarFlare} strokeWidth="2" className="active-connector" />
                        </svg>
                        <div className="triangle-center" style={{ left: centerX, top: centerY }}>
                            <div className="center-core" style={{ backgroundColor: c.solarFlare }} />
                        </div>
                        {features.map((feature, i) => {
                            const pos = getPosition(i);
                            const isActive = activeFeature === i;
                            return (
                                <button
                                    key={i}
                                    className={`triangle-node ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveFeature(i)}
                                    style={{
                                        left: pos.x, top: pos.y,
                                        borderColor: isActive ? c.solarFlare : c.border,
                                        backgroundColor: isActive ? c.solarFlare : c.nebula,
                                        color: isActive ? c.void : c.starlight,
                                    }}
                                >
                                    <span className="node-icon">{feature.icon}</span>
                                    <span className="node-label">{feature.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="feature-panel-container">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className={`feature-panel ${activeFeature === i ? 'active' : ''}`}
                                style={{ backgroundColor: c.nebula, borderColor: c.border }}
                            >
                                <div className="panel-badge" style={{ backgroundColor: c.solarFlare, color: c.void }}>
                                    {feature.icon} {feature.label}
                                </div>
                                <h3 style={{ color: c.starlight }}>{feature.title}</h3>
                                <p style={{ color: c.moonlight }}>{feature.description}</p>
                                <div className="capabilities">
                                    {feature.capabilities.map((cap, j) => (
                                        <div key={j} className="capability" style={{ borderColor: c.border }}>
                                            <span className="cap-dot" style={{ backgroundColor: c.solarFlare }} />
                                            <span style={{ color: c.distant }}>{cap}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

FeatureTriangle.displayName = 'FeatureTriangle';
