import { memo } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

// TODO: Replace with Google Form URL
const WAITLIST_FORM_URL = '#';

interface FinalCTAProps {
    c: ThemeColors;
    isDark: boolean;
}

export const FinalCTA = memo(({ c, isDark }: FinalCTAProps) => (
    <section className="cta-section">
        <CosmicOrb size={800} x={50} y={50} isDark={isDark} />
        <CosmicOrb size={400} x={20} y={30} isDark={isDark} accent />

        <div className="cta-content">
            <div className="cta-badge" style={{ borderColor: c.solarFlare, color: c.solarFlare }}>Ready to begin?</div>
            <h2 style={{ color: c.starlight }}>The universe of knowledge<br />awaits your curiosity.</h2>
            <p style={{ color: c.moonlight }}>Join thousands of curious minds transforming how they learn.</p>
            <div className="cta-buttons">
                <a
                    href={WAITLIST_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary large"
                    style={{ backgroundColor: c.solarFlare, color: c.void, textDecoration: 'none' }}
                >
                    Start your journey<span className="btn-arrow">→</span>
                </a>
                <button className="btn-ghost" style={{ color: c.starlight, borderColor: c.border }}>Explore the docs</button>
            </div>
        </div>
    </section>
));

FinalCTA.displayName = 'FinalCTA';
