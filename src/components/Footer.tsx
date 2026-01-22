import { memo } from 'react';
import type { ThemeColors } from '../types/theme';

interface FooterProps {
    c: ThemeColors;
}

export const Footer = memo(({ c }: FooterProps) => (
    <footer className="footer" style={{ borderTopColor: c.border, backgroundColor: c.nebula }}>
        <div className="footer-brand">
            <span className="footer-logo" style={{ color: c.starlight }}>
                <span style={{ color: c.solarFlare }}>◉</span> notecase
            </span>
            <span className="footer-tagline" style={{ color: c.distant }}>Follow curiosity.</span>
        </div>
        <div className="footer-links">
            {['Privacy', 'Terms', 'Twitter', 'GitHub'].map((link) => (
                <a key={link} href="#" style={{ color: c.distant }}>{link}</a>
            ))}
        </div>
        <div className="footer-copyright" style={{ color: c.distant }}>© 2025 Notecase</div>
    </footer>
));

Footer.displayName = 'Footer';
