import { useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '../types/theme';
import {
  Hero,
  StickyFeatures,
  InteractiveDemo,
  FeatureTriangle,
  LearningModes,
  ComparisonTable,
  Waitlist,
  FinalCTA,
} from '../components';

export function HomePage() {
  const { c, isDark } = useOutletContext<LayoutContext>();

  return (
    <>
      <Hero c={c} isDark={isDark} />
      <StickyFeatures c={c} isDark={isDark} />
      <InteractiveDemo c={c} isDark={isDark} />
      <FeatureTriangle c={c} isDark={isDark} />
      <LearningModes c={c} isDark={isDark} />
      <ComparisonTable c={c} isDark={isDark} />
      <Waitlist c={c} isDark={isDark} />
      <FinalCTA c={c} isDark={isDark} />
    </>
  );
}
