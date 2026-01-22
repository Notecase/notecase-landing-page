import { useState, useEffect } from 'react';
import { themes } from './utils/themes';
import type { ThemeMode } from './types/theme';
import {
  CosmicBackground,
  Nav,
  Hero,
  StickyFeatures,
  InteractiveDemo,
  FeatureTriangle,
  LearningModes,
  Pricing,
  FinalCTA,
  Footer,
} from './components';
import './styles/global.css';

function App() {
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
      <Hero c={c} isDark={isDark} />
      <StickyFeatures c={c} isDark={isDark} />
      <InteractiveDemo c={c} isDark={isDark} />
      <FeatureTriangle c={c} isDark={isDark} />
      <LearningModes c={c} isDark={isDark} />
      <Pricing c={c} isDark={isDark} />
      <FinalCTA c={c} isDark={isDark} />
      <Footer c={c} />
    </div>
  );
}

export default App;
