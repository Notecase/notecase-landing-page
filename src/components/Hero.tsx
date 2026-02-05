import { memo } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface HeroProps {
    c: ThemeColors;
    isDark: boolean;
}

export const Hero = memo(({ c, isDark }: HeroProps) => (
    <section className="hero">
        <CosmicOrb size={800} x={15} y={40} isDark={isDark} />
        <CosmicOrb size={400} x={85} y={30} isDark={isDark} accent />
        <CosmicOrb size={300} x={70} y={80} isDark={isDark} />

        <div className="hero-content">
            <div className="hero-tag" style={{ borderColor: c.border, color: c.moonlight }}>
                <span className="pulse-dot" style={{ backgroundColor: c.solarFlare }} />
                agent-first learning platform
            </div>

            <h1 className="hero-headline" style={{ color: c.starlight }}>
                Follow<br />
                <span className="headline-accent">Curiosity.</span>
            </h1>

            <p className="hero-subheadline" style={{ color: c.moonlight }}>
                Let Noteshell build your learning path.
            </p>

            <p className="hero-description" style={{ color: c.distant }}>
                More than notes. An agent-first platform that joins your journey
                and turns every spark of curiosity into tangible knowledge.
            </p>

            <div className="hero-cta">
                <button className="btn-primary" style={{ backgroundColor: c.solarFlare, color: c.void }}>
                    <span>Begin your journey</span>
                    <span className="btn-arrow">→</span>
                </button>
                <button className="btn-ghost" style={{ color: c.starlight, borderColor: c.border }}>
                    Watch demo
                </button>
            </div>

            <div className="hero-metrics">
                <div className="metric" style={{ borderColor: c.border, backgroundColor: c.nebula }}>
                    <span className="metric-value" style={{ color: c.starlight }}>10min</span>
                    <span className="metric-label" style={{ color: c.distant }}>avg. learning time</span>
                </div>
                <div className="metric" style={{ borderColor: c.border, backgroundColor: c.nebula }}>
                    <span className="metric-value" style={{ color: c.starlight }}>∞</span>
                    <span className="metric-label" style={{ color: c.distant }}>topics to explore</span>
                </div>
                <div className="metric" style={{ borderColor: c.border, backgroundColor: c.nebula }}>
                    <span className="metric-value" style={{ color: c.starlight }}>1</span>
                    <span className="metric-label" style={{ color: c.distant }}>curious mind</span>
                </div>
            </div>
        </div>

        <div className="scroll-cue" style={{ color: c.distant }}>
            <span>scroll to explore</span>
            <div className="scroll-line" style={{ backgroundColor: c.border }}>
                <div className="scroll-dot" style={{ backgroundColor: c.solarFlare }} />
            </div>
        </div>
    </section>
));

Hero.displayName = 'Hero';
