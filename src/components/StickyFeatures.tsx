import { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
        image: '/demos/accelerate.png',
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
        image: '/demos/capture.png',
    },
    {
        number: '03',
        label: 'ORCHESTRATE',
        title: 'An AI secretary that never lets you off track',
        description: 'A daily planner that understands your goals, builds your schedule, and nudges you forward. It tracks active plans, maps your week, and ensures nothing falls through the cracks.',
        metric: '24/7',
        metricUnit: 'focus',
        metricLabel: 'Your personal AI secretary, always watching your progress.',
        icon: '◈',
        frameText: 'Orchestrating your day',
        image: '/demos/secretary.png',
    },
    {
        number: '04',
        label: 'EXPLORE',
        title: 'An agent that helps you truly understand',
        description: "Go beyond surface-level answers. This agent helps you grasp concepts deeply, revise what you've learned, and dive further into any topic\u2014powered by research and synthesis across your sources and the entire web.",
        metric: '∞',
        metricUnit: 'depth',
        metricLabel: 'No ceiling on how deep you can go. The agent grows with you.',
        icon: '◉',
        frameText: 'Exploring depths',
        image: '/demos/explore.png',
    },
];

function getActiveIndex(progress: number): number {
    if (progress < 0.25) return 0;
    if (progress < 0.50) return 1;
    if (progress < 0.75) return 2;
    return 3;
}

// Memoized content item to prevent unnecessary re-renders
const FeatureContentItem = memo(({ feature, isActive, c }: {
    feature: typeof features[0];
    isActive: boolean;
    c: ThemeColors;
}) => (
    <div
        className="feature-content-item"
        style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: isActive ? 'auto' : 'none',
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
), (prev, next) => prev.isActive === next.isActive && prev.c === next.c);

FeatureContentItem.displayName = 'FeatureContentItem';

// Memoized visual item with CSS transition for smooth discrete switching
const FeatureVisualItem = memo(({ feature, isActive, index, c }: {
    feature: typeof features[0];
    isActive: boolean;
    index: number;
    c: ThemeColors;
}) => (
    <div
        style={{
            position: index === 0 ? 'relative' : 'absolute',
            inset: 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {feature.image ? (
            <img src={feature.image} alt={feature.label} />
        ) : (
            <>
                <span className="frame-icon" style={{ color: c.solarFlare }}>
                    {feature.icon}
                </span>
                <span className="frame-text" style={{ color: c.distant }}>
                    {feature.frameText}
                </span>
            </>
        )}
    </div>
), (prev, next) => prev.isActive === next.isActive && prev.c === next.c);

FeatureVisualItem.displayName = 'FeatureVisualItem';

export const StickyFeatures = memo(({ c, isDark }: StickyFeaturesProps) => {
    const [progress, setProgress] = useState(0);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Cache static layout values — only update on resize
    const layoutRef = useRef({ sectionTop: 0, sectionHeight: 0, viewportHeight: 0 });

    const updateLayout = useCallback(() => {
        if (!sectionRef.current) return;
        const section = sectionRef.current;
        layoutRef.current = {
            sectionTop: section.offsetTop,
            sectionHeight: section.offsetHeight,
            viewportHeight: window.innerHeight,
        };
    }, []);

    useEffect(() => {
        updateLayout();

        // RAF-throttled scroll handler (caps at 60fps)
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const { sectionTop, sectionHeight, viewportHeight } = layoutRef.current;
                const totalScroll = sectionHeight - viewportHeight;
                if (totalScroll <= 0) { ticking = false; return; }

                const scrolledIntoSection = window.scrollY - sectionTop;
                const raw = Math.max(0, Math.min(1, scrolledIntoSection / totalScroll));
                // Round to 2 decimals — only update if change > 0.01
                const rounded = Math.round(raw * 100) / 100;

                setProgress(prev => {
                    if (Math.abs(prev - rounded) < 0.01) return prev;
                    return rounded;
                });
                ticking = false;
            });
        };

        // Update layout on resize
        const resizeObserver = new ResizeObserver(() => {
            updateLayout();
        });
        if (sectionRef.current) {
            resizeObserver.observe(sectionRef.current);
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [updateLayout]);

    // Compute discrete active index from progress
    const activeIndex = useMemo(
        () => getActiveIndex(progress),
        [progress]
    );

    return (
        <section id="journey" className="sticky-features" ref={sectionRef}>
            <div className="sticky-container-simplified">
                <CosmicOrb size={600} x={85} y={50} isDark={isDark} />

                <div className="feature-content feature-content-wrapper">
                    {features.map((feature, i) => (
                        <FeatureContentItem
                            key={feature.number}
                            feature={feature}
                            isActive={i === activeIndex}
                            c={c}
                        />
                    ))}
                </div>

                <div className="feature-visual">
                    <div
                        className="visual-frame"
                        style={{ borderColor: c.border, backgroundColor: c.nebula }}
                        onClick={() => {
                            const img = features[activeIndex]?.image;
                            if (img) setModalImage(img);
                        }}
                    >
                        <div className="frame-glow" style={{ backgroundColor: c.solarFlare }} />
                        <div className="frame-content" style={{ position: 'relative' }}>
                            {features.map((feature, i) => (
                                <FeatureVisualItem
                                    key={feature.number}
                                    feature={feature}
                                    isActive={i === activeIndex}
                                    index={i}
                                    c={c}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {modalImage && (
                <div className="demo-modal-overlay" onClick={() => setModalImage(null)}>
                    <img src={modalImage} alt="Demo preview" />
                </div>
            )}
        </section>
    );
});

StickyFeatures.displayName = 'StickyFeatures';
