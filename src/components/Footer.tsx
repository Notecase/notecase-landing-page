import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { ThemeColors } from '../types/theme';

interface FooterProps {
    c: ThemeColors;
}

export const Footer = memo(({ c }: FooterProps) => (
    <footer className="footer" style={{ borderTopColor: c.border, backgroundColor: c.nebula }}>
        <div className="footer-brand">
            <span className="footer-logo" style={{ color: c.starlight }}>
                <span style={{ color: c.solarFlare }}>&#x25C9;</span> Noteshell
            </span>
            <span className="footer-tagline" style={{ color: c.distant }}>Follow curiosity.</span>
        </div>
        <div className="footer-links">
            <Link to="/about" style={{ color: c.distant }}>About</Link>
            {['Privacy', 'Terms', 'Twitter', 'GitHub'].map((link) => (
                <a key={link} href="#" style={{ color: c.distant }}>{link}</a>
            ))}
        </div>
        <div className="footer-copyright" style={{ color: c.distant }}>&copy; 2026 Noteshell</div>
    </footer>
));

Footer.displayName = 'Footer';
