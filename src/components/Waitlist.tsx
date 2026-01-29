import { memo } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

// TODO: Replace with Google Form URL
const WAITLIST_FORM_URL = '#';

interface WaitlistProps {
    c: ThemeColors;
    isDark: boolean;
}

export const Waitlist = memo(({ c, isDark }: WaitlistProps) => (
    <section id="waitlist" className="waitlist-section">
        <CosmicOrb size={600} x={50} y={50} isDark={isDark} />
        <CosmicOrb size={300} x={10} y={20} isDark={isDark} accent />
        <CosmicOrb size={350} x={90} y={80} isDark={isDark} />

        <div className="container">
            <div className="section-header center">
                <span className="section-tag" style={{ color: c.solarFlare }}>◉ EARLY ACCESS</span>
                <h2 style={{ color: c.starlight }}>Be the first to explore</h2>
                <p style={{ color: c.moonlight }}>
                    NoteCase is launching soon. Join the waitlist to get early access and
                    help shape the future of learning.
                </p>
            </div>

            <div className="waitlist-cta">
                <a
                    href={WAITLIST_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary large waitlist-btn"
                    style={{ backgroundColor: c.solarFlare, color: c.void }}
                >
                    Join the Waitlist<span className="btn-arrow">→</span>
                </a>
            </div>
        </div>
    </section>
));

Waitlist.displayName = 'Waitlist';
