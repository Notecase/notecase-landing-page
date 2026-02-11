import { memo } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

const WAITLIST_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfyEoHmFAXD0plWwSXWNrm6PYz4QYSThChYDGvr4k67cPlzKQ/viewform';

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
                    Join the Waitlist<span className="btn-arrow">→</span>
                </a>
                <a href="https://app.noteshell.io/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ color: c.starlight, borderColor: c.border, textDecoration: 'none' }}>Try the Demo</a>
            </div>
        </div>
    </section>
));

FinalCTA.displayName = 'FinalCTA';
