import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { themes } from '../utils/themes';
import type { ThemeMode } from '../types/theme';
import { CosmicBackground } from './CosmicBackground';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ScrollToHash } from './ScrollToHash';

export function Layout() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isScrolled, setIsScrolled] = useState(false);

  const c = themes[theme];
  const isDark = theme === 'dark';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      backgroundColor: c.void,
      color: c.starlight,
      minHeight: '100vh',
      position: 'relative',
      transition: 'background-color 0.4s, color 0.4s'
    }}>
      <CosmicBackground c={c} isDark={isDark} />
      <Nav theme={theme} setTheme={setTheme} c={c} isScrolled={isScrolled} />
      <ScrollToHash />
      <Outlet context={{ c, isDark }} />
      <Footer c={c} />
    </div>
  );
}
