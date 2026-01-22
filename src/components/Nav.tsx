import { memo } from 'react';
import type { ThemeColors, ThemeMode } from '../types/theme';

interface NavProps {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    c: ThemeColors;
    isScrolled: boolean;
}

export const Nav = memo(({ theme, setTheme, c, isScrolled }: NavProps) => (
    <nav className="nav" style={{
        backgroundColor: isScrolled ? (theme === 'dark' ? 'rgba(10,10,10,0.95)' : 'rgba(250,250,250,0.95)') : 'transparent',
        borderBottom: `1px solid ${isScrolled ? c.border : 'transparent'}`,
    }}>
        <div className="nav-logo" style={{ color: c.starlight }}>
            <span className="logo-icon" style={{ color: c.solarFlare }}>◉</span>
            notecase
        </div>

        <div className="nav-links">
            <a href="#journey" style={{ color: c.moonlight }}>journey</a>
            <a href="#demo" style={{ color: c.moonlight }}>demo</a>
            <a href="#pricing" style={{ color: c.moonlight }}>pricing</a>

            <button
                className="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{ border: `1px solid ${c.border}`, color: c.starlight }}
            >
                {theme === 'dark' ? '☀' : '☽'}
            </button>
        </div>
    </nav>
));

Nav.displayName = 'Nav';
