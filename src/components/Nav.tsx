import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ThemeColors, ThemeMode } from '../types/theme';

interface NavProps {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    c: ThemeColors;
    isScrolled: boolean;
}

export const Nav = memo(({ theme, setTheme, c, isScrolled }: NavProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    const handleHashLink = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
            e.preventDefault();
            if (isHome) {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(`/#${id}`);
            }
        },
        [isHome, navigate],
    );

    return (
        <nav className="nav" style={{
            backgroundColor: isScrolled ? (theme === 'dark' ? 'rgba(10,10,10,0.95)' : 'rgba(250,250,250,0.95)') : 'transparent',
            borderBottom: `1px solid ${isScrolled ? c.border : 'transparent'}`,
        }}>
            <Link to="/" className="nav-logo" style={{ color: c.starlight, textDecoration: 'none' }}>
                <span className="logo-icon" style={{ color: c.solarFlare }}>&#x25C9;</span>
                Noteshell
            </Link>

            <div className="nav-links">
                <Link to="/about" style={{ color: c.moonlight }}>about</Link>
                <a href="#journey" onClick={(e) => handleHashLink(e, 'journey')} style={{ color: c.moonlight }}>journey</a>
                <a href="#demo" onClick={(e) => handleHashLink(e, 'demo')} style={{ color: c.moonlight }}>demo</a>
                <a href="#waitlist" onClick={(e) => handleHashLink(e, 'waitlist')} style={{ color: c.moonlight }}>waitlist</a>

                <button
                    className="theme-toggle"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    style={{ border: `1px solid ${c.border}`, color: c.starlight }}
                >
                    {theme === 'dark' ? '\u2600' : '\u263D'}
                </button>
            </div>
        </nav>
    );
});

Nav.displayName = 'Nav';
