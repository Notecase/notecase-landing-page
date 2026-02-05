import { memo, useState } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface LearningModesProps {
    c: ThemeColors;
    isDark: boolean;
}

const modes = [
    { id: 'video', label: 'Video-first', icon: '▶', description: 'Learn through curated video content and visual explanations.', imageAlt: 'Video learning interface' },
    { id: 'slides', label: 'Slides-first', icon: '◧', description: 'Structured presentations for systematic learning.', imageAlt: 'Slide presentation view' },
    { id: 'research', label: 'Deep research', icon: '◉', description: 'Long-form articles and academic papers.', imageAlt: 'Research documentation' },
    { id: 'practice', label: 'Practice mode', icon: '◈', description: 'Interactive quizzes and problem solving.', imageAlt: 'Practice interface' },
    { id: 'project', label: 'Project workspace', icon: '◫', description: 'Organized spaces for building.', imageAlt: 'Project workspace' },
    { id: 'flow', label: 'Go with the flow', icon: '∿', description: 'Spontaneous exploration.', imageAlt: 'Free exploration' },
];

export const LearningModes = memo(({ c, isDark }: LearningModesProps) => {
    const [activeMode, setActiveMode] = useState<string | null>(null);

    return (
        <section id="modes" className="modes-section">
            <CosmicOrb size={400} x={90} y={30} isDark={isDark} accent />

            <div className="container">
                <div className="section-header">
                    <span className="section-tag" style={{ color: c.solarFlare }}>◉ ADAPTIVE LEARNING</span>
                    <h2 style={{ color: c.starlight }}>A thousand ways to learn</h2>
                    <p style={{ color: c.moonlight }}>Noteshell adapts the outputs to how you learn best.</p>
                </div>

                <div className="modes-grid">
                    {modes.map((mode) => {
                        const isActive = activeMode === mode.id;
                        return (
                            <div
                                key={mode.id}
                                className={`mode-card ${isActive ? 'active' : ''}`}
                                onClick={() => setActiveMode(isActive ? null : mode.id)}
                                style={{
                                    backgroundColor: isActive ? c.starlight : c.nebula,
                                    borderColor: isActive ? c.starlight : c.border,
                                }}
                            >
                                <div className="mode-image-placeholder" style={{ backgroundColor: isActive ? c.void : c.dust, borderColor: c.border }}>
                                    <div className="placeholder-content">
                                        <span className="placeholder-icon" style={{ color: isActive ? c.moonlight : c.distant }}>{mode.icon}</span>
                                        <span className="placeholder-text" style={{ color: isActive ? c.distant : c.border }}>{mode.imageAlt}</span>
                                    </div>
                                    <div className="corner tl" style={{ borderColor: isActive ? c.distant : c.border }} />
                                    <div className="corner tr" style={{ borderColor: isActive ? c.distant : c.border }} />
                                    <div className="corner bl" style={{ borderColor: isActive ? c.distant : c.border }} />
                                    <div className="corner br" style={{ borderColor: isActive ? c.distant : c.border }} />
                                </div>
                                <div className="mode-content">
                                    <div className="mode-header">
                                        <span className="mode-icon" style={{ color: isActive ? c.void : c.starlight }}>{mode.icon}</span>
                                        <span className="mode-label" style={{ color: isActive ? c.void : c.starlight }}>{mode.label}</span>
                                    </div>
                                    <p className={`mode-description ${isActive ? 'show' : ''}`} style={{ color: isActive ? c.distant : c.moonlight }}>
                                        {mode.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

LearningModes.displayName = 'LearningModes';
