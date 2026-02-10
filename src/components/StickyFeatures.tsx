import { memo, useState, useEffect, useRef } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface StickyFeaturesProps {
    c: ThemeColors;
    isDark: boolean;
}

const features = [
    {
        number: '01',
        label: 'ACCELERATE',
        title: 'Turn learning into your fastest task',
        description: 'For too long, learning felt like work—searching, sketching, digesting, revising. Noteshell automates the heavy lifting so learning feels natural and enjoyable.',
        metric: '60→10',
        metricUnit: 'min',
        metricLabel: 'Turn an hour of scattered learning into 10 minutes of structured clarity.',
        icon: '⚡',
        frameText: 'Acceleration in progress',
    },
    {
        number: '02',
        label: 'CAPTURE',
        title: 'Built for the moment you get curious',
        description: 'The core idea is simple: capture the very first spark in your mind, explain it clearly, and save it into a complete knowledge vault—all in seconds.',
        metric: '<3',
        metricUnit: 'sec',
        metricLabel: 'From thought to structured note in the blink of an eye.',
        icon: '✦',
        frameText: 'Capturing spark',
    },
    {
        number: '03',
        label: 'EXPLORE',
        title: 'An agent companion beyond the obvious',
        description: 'Dive into any concept and build a foundation from the roots—using deep research and synthesis across your sources and the entire web.',
        metric: '∞',
        metricUnit: 'depth',
        metricLabel: 'No ceiling on how deep you can go. The agent grows with you.',
        icon: '◉',
        frameText: 'Exploring depths',
    },
];

function getFeatureOpacity(index: number, progress: number): number {
    const featureCenter = (index + 0.5) / 3;
    const distance = Math.abs(progress - featureCenter);
    return Math.max(0, Math.min(1, 1 - distance * 4));
}

export const StickyFeatures = memo(({ c, isDark }: StickyFeaturesProps) => {
    const [progress, setProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const section = sectionRef.current;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY;

            const scrolledIntoSection = scrollY - sectionTop;
            const totalScroll = sectionHeight - viewportHeight;

            const p = Math.max(0, Math.min(1, scrolledIntoSection / totalScroll));
            setProgress(p);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="journey" className="sticky-features" ref={sectionRef}>
            <div className="sticky-container-simplified">
                <CosmicOrb size={600} x={85} y={50} isDark={isDark} />

                <div className="feature-content feature-content-wrapper">
                    {features.map((feature, i) => {
                        const opacity = getFeatureOpacity(i, progress);
                        return (
                            <div
                                key={feature.number}
                                className="feature-content-item"
                                style={{
                                    opacity,
                                    pointerEvents: opacity > 0.5 ? 'auto' : 'none',
                                }}
                            >
                                <div className="feature-header">
                                    <span className="feature-number" style={{ color: c.solarFlare }}>{feature.number}</span>
                                </div>
                                <h2 className="feature-title" style={{ color: c.starlight }}>{feature.title}</h2>
                                <p className="feature-description" style={{ color: c.moonlight }}>{feature.description}</p>
                                <div className="feature-metric-card" style={{ backgroundColor: c.nebula, borderColor: c.border }}>
                                    <div className="metric-main">
                                        <span className="metric-number" style={{ color: c.starlight }}>{feature.metric}</span>
                                        <span className="metric-unit" style={{ color: c.solarFlare }}>{feature.metricUnit}</span>
                                    </div>
                                    <p className="metric-description" style={{ color: c.distant }}>{feature.metricLabel}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="feature-visual">
                    <div className="visual-frame" style={{ borderColor: c.border, backgroundColor: c.nebula }}>
                        <div className="frame-glow" style={{ backgroundColor: c.solarFlare }} />
                        <div className="frame-content" style={{ position: 'relative' }}>
                            {features.map((feature, i) => {
                                const opacity = getFeatureOpacity(i, progress);
                                return (
                                    <div
                                        key={feature.number}
                                        style={{
                                            position: i === 0 ? 'relative' : 'absolute',
                                            inset: 0,
                                            opacity,
                                            transition: 'opacity 0.15s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span className="frame-icon" style={{ color: c.solarFlare }}>
                                            {feature.icon}
                                        </span>
                                        <span className="frame-text" style={{ color: c.distant }}>
                                            {feature.frameText}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

StickyFeatures.displayName = 'StickyFeatures';
