import { memo, useState, useEffect, useRef, useCallback } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface InteractiveDemoProps {
    c: ThemeColors;
    isDark: boolean;
}

const steps = [
    {
        id: 'spark',
        title: 'Spark',
        subtitle: 'A question enters your mind',
        prompt: 'What is quantum entanglement and why does it matter?',
        instruction: 'Press Enter or click to capture',
        icon: '✦',
        color: '#f59e0b',
    },
    {
        id: 'capture',
        title: 'Capture',
        subtitle: 'Noteshell saves the moment',
        processing: 'Creating new note...',
        result: 'Note created: "Quantum Entanglement"',
        resultIcon: '📝',
        instruction: 'Press Enter to explore',
        icon: '◎',
        color: '#3b82f6',
    },
    {
        id: 'explore',
        title: 'Explore',
        subtitle: 'The agent researches deeply',
        processing: 'Searching 847 sources...',
        result: 'Found: 12 articles • 3 videos • 2 papers',
        resultIcon: '🔍',
        instruction: 'Press Enter to synthesize',
        icon: '◈',
        color: '#8b5cf6',
    },
    {
        id: 'understand',
        title: 'Understand',
        subtitle: 'Knowledge crystallizes',
        processing: 'Synthesizing information...',
        result: 'Generated: Summary • Key concepts • Mind map',
        resultIcon: '💡',
        instruction: 'Press Enter to complete',
        icon: '◇',
        color: '#10b981',
    },
    {
        id: 'apply',
        title: 'Apply',
        subtitle: 'Ready to use',
        processing: 'Preparing study tools...',
        result: 'Ready: 8 flashcards • 1 quiz • Structured notes',
        resultIcon: '✅',
        instruction: 'Press Enter to restart',
        icon: '◫',
        color: '#f59e0b',
    },
];

export const InteractiveDemo = memo(({ c, isDark }: InteractiveDemoProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentStepData = steps[currentStep];

    // Typewriter effect for first step
    useEffect(() => {
        if (currentStep === 0 && typedText.length < currentStepData.prompt!.length) {
            const timeout = setTimeout(() => {
                setTypedText(currentStepData.prompt!.slice(0, typedText.length + 1));
            }, 35);
            return () => clearTimeout(timeout);
        }
    }, [currentStep, typedText, currentStepData.prompt]);

    // Processing and result animation for other steps
    useEffect(() => {
        if (currentStep > 0) {
            setIsProcessing(true);
            setShowResult(false);
            const processingTimeout = setTimeout(() => {
                setIsProcessing(false);
                setShowResult(true);
            }, 1200);
            return () => clearTimeout(processingTimeout);
        }
    }, [currentStep]);

    const advanceStep = useCallback(() => {
        if (currentStep === 0 && typedText.length < currentStepData.prompt!.length) {
            // Fast-forward typing
            setTypedText(currentStepData.prompt!);
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTypedText('');
            setShowResult(false);
        } else {
            // Reset to beginning
            setCurrentStep(0);
            setTypedText('');
            setShowResult(false);
            setIsProcessing(false);
        }
    }, [currentStep, typedText, currentStepData.prompt]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            advanceStep();
        }
    }, [advanceStep]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.focus({ preventScroll: true });
        }
    }, []);

    return (
        <section id="demo" className="demo-section">
            <CosmicOrb size={500} x={10} y={40} isDark={isDark} />
            <CosmicOrb size={400} x={90} y={70} isDark={isDark} accent />

            <div className="container">
                <div className="section-header center">
                    <span className="section-tag" style={{ color: c.solarFlare }}>◉ EXPERIENCE THE JOURNEY</span>
                    <h2 style={{ color: c.starlight }}>From curiosity to creation</h2>
                    <p style={{ color: c.moonlight }}>
                        See how Noteshell transforms a simple question into structured knowledge.
                        <br />
                        <span style={{ color: c.distant, fontSize: '14px' }}>Click or press Enter to interact</span>
                    </p>
                </div>

                {/* macOS Safari-style Window */}
                <div
                    className="browser-window"
                    style={{
                        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                        boxShadow: isDark
                            ? '0 50px 100px -20px rgba(0,0,0,0.6), 0 30px 60px -30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
                            : '0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'
                    }}
                    onClick={advanceStep}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    ref={containerRef}
                >
                    {/* Window Title Bar */}
                    <div className="window-titlebar" style={{
                        backgroundColor: isDark ? '#2c2c2e' : '#f5f5f7',
                        borderBottomColor: isDark ? '#3a3a3c' : '#d1d1d6'
                    }}>
                        {/* Traffic Lights */}
                        <div className="traffic-lights">
                            <span className="light close" />
                            <span className="light minimize" />
                            <span className="light maximize" />
                        </div>

                        {/* URL Bar */}
                        <div className="url-bar-container">
                            <div className="url-bar" style={{
                                backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                                borderColor: isDark ? '#3a3a3c' : '#d1d1d6'
                            }}>
                                <span className="url-lock" style={{ color: isDark ? '#86868b' : '#86868b' }}>🔒</span>
                                <span className="url-text" style={{ color: isDark ? '#f5f5f7' : '#1d1d1f' }}>
                                    app.noteshell.ai
                                </span>
                            </div>
                        </div>

                        {/* Window Controls */}
                        <div className="window-controls">
                            <span style={{ color: isDark ? '#86868b' : '#86868b' }}>⋮⋮</span>
                        </div>
                    </div>

                    {/* App Content */}
                    <div className="app-content" style={{ backgroundColor: c.void }}>
                        {/* App Sidebar */}
                        <div className="app-sidebar" style={{ backgroundColor: c.nebula, borderRightColor: c.border }}>
                            <div className="sidebar-header">
                                <span className="sidebar-logo" style={{ color: c.solarFlare }}>◉</span>
                                <span style={{ color: c.starlight, fontWeight: 600 }}>Noteshell</span>
                            </div>
                            <div className="sidebar-nav">
                                {['Home', 'Notes', 'Explore', 'Flashcards'].map((item, i) => (
                                    <div
                                        key={item}
                                        className={`sidebar-item ${i === 1 ? 'active' : ''}`}
                                        style={{
                                            color: i === 1 ? c.starlight : c.distant,
                                            backgroundColor: i === 1 ? c.dust : 'transparent'
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Area */}
                        <div className="app-main">
                            {/* Step Progress Bar */}
                            <div className="demo-progress-bar" style={{ borderBottomColor: c.border }}>
                                {steps.map((step, i) => (
                                    <div
                                        key={step.id}
                                        className={`progress-step ${currentStep === i ? 'active' : ''} ${currentStep > i ? 'completed' : ''}`}
                                    >
                                        <div
                                            className="progress-step-dot"
                                            style={{
                                                backgroundColor: currentStep >= i ? step.color : c.dust,
                                                borderColor: currentStep >= i ? step.color : c.border,
                                            }}
                                        >
                                            {currentStep > i && <span className="check">✓</span>}
                                        </div>
                                        <span
                                            className="progress-step-label"
                                            style={{ color: currentStep === i ? c.starlight : c.distant }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                                <div className="progress-track" style={{ backgroundColor: c.border }}>
                                    <div
                                        className="progress-track-fill"
                                        style={{
                                            backgroundColor: c.solarFlare,
                                            width: `${(currentStep / (steps.length - 1)) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Main Demo Content */}
                            <div className="demo-content-area">
                                <div className="demo-step-header">
                                    <span
                                        className="step-icon"
                                        style={{ backgroundColor: currentStepData.color + '20', color: currentStepData.color }}
                                    >
                                        {currentStepData.icon}
                                    </span>
                                    <div>
                                        <h3 style={{ color: c.starlight }}>{currentStepData.title}</h3>
                                        <p style={{ color: c.distant }}>{currentStepData.subtitle}</p>
                                    </div>
                                </div>

                                {/* Interactive Area */}
                                <div className="demo-interactive" style={{ backgroundColor: c.nebula, borderColor: c.border }}>
                                    {currentStep === 0 ? (
                                        // Typing state
                                        <div className="typing-container">
                                            <div className="input-label" style={{ color: c.distant }}>Your question</div>
                                            <div className="input-field" style={{ borderColor: c.border, backgroundColor: c.void }}>
                                                <span style={{ color: c.starlight }}>{typedText}</span>
                                                <span className="typing-cursor" style={{ backgroundColor: c.solarFlare }} />
                                            </div>
                                        </div>
                                    ) : (
                                        // Processing/Result state
                                        <div className="result-container">
                                            {isProcessing ? (
                                                <div className="processing-state">
                                                    <div className="spinner" style={{ borderColor: c.border, borderTopColor: currentStepData.color }} />
                                                    <span style={{ color: c.moonlight }}>{currentStepData.processing}</span>
                                                </div>
                                            ) : showResult ? (
                                                <div className="result-state">
                                                    <span className="result-icon">{currentStepData.resultIcon}</span>
                                                    <span style={{ color: c.starlight }}>{currentStepData.result}</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>

                                {/* Action hint */}
                                <div className="demo-action-hint">
                                    <span className="key-badge" style={{ backgroundColor: c.dust, borderColor: c.border, color: c.moonlight }}>
                                        ↵
                                    </span>
                                    <span style={{ color: c.distant }}>{currentStepData.instruction}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

InteractiveDemo.displayName = 'InteractiveDemo';
