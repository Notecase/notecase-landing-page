import { memo, useState } from 'react';
import type { ThemeColors } from '../types/theme';
import { CosmicOrb } from './CosmicOrb';

interface PricingProps {
    c: ThemeColors;
    isDark: boolean;
}

const plans = [
    {
        name: 'Spark',
        icon: '✦',
        tagline: 'For curious beginners',
        priceMonthly: 0,
        priceYearly: 0,
        features: [
            '50 notes per month',
            '5 AI explorations',
            'Basic flashcards',
            'Community support',
        ],
        cta: 'Start free',
        popular: false,
    },
    {
        name: 'Nova',
        icon: '◉',
        tagline: 'For serious learners',
        priceMonthly: 19,
        priceYearly: 15,
        features: [
            'Unlimited notes',
            'Unlimited explorations',
            'Advanced study tools',
            'Source integration',
            'Export anywhere',
            'Priority support',
        ],
        cta: 'Start 14-day trial',
        popular: true,
    },
    {
        name: 'Galaxy',
        icon: '✧',
        tagline: 'For teams',
        priceMonthly: 49,
        priceYearly: 39,
        features: [
            'Everything in Nova',
            'Team workspaces',
            'Shared knowledge bases',
            'Admin dashboard',
            'SSO & security',
            'Dedicated support',
        ],
        cta: 'Contact sales',
        popular: false,
    },
];

export const Pricing = memo(({ c, isDark }: PricingProps) => {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <section id="pricing" className="pricing-section">
            <CosmicOrb size={600} x={50} y={50} isDark={isDark} />
            <CosmicOrb size={300} x={10} y={20} isDark={isDark} accent />
            <CosmicOrb size={350} x={90} y={80} isDark={isDark} />

            <div className="container">
                <div className="section-header center">
                    <span className="section-tag" style={{ color: c.solarFlare }}>◉ PRICING</span>
                    <h2 style={{ color: c.starlight }}>Choose your orbit</h2>
                    <p style={{ color: c.moonlight }}>Start free. Scale as you grow.</p>
                </div>

                {/* Billing Toggle */}
                <div className="billing-toggle">
                    <span style={{ color: !isYearly ? c.starlight : c.distant, fontWeight: !isYearly ? 600 : 400 }}>Monthly</span>
                    <button
                        className="toggle-switch"
                        onClick={() => setIsYearly(!isYearly)}
                        style={{ backgroundColor: c.dust, borderColor: c.border }}
                        aria-label="Toggle billing period"
                    >
                        <span
                            className={`toggle-knob ${isYearly ? 'yearly' : ''}`}
                            style={{ backgroundColor: c.solarFlare }}
                        />
                    </button>
                    <span style={{ color: isYearly ? c.starlight : c.distant, fontWeight: isYearly ? 600 : 400 }}>
                        Yearly
                        <span className="save-badge" style={{ backgroundColor: c.solarFlare, color: c.void }}>-20%</span>
                    </span>
                </div>

                {/* Pricing Cards */}
                <div className="pricing-grid">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                            style={{
                                backgroundColor: plan.popular ? c.starlight : c.nebula,
                                borderColor: plan.popular ? c.solarFlare : c.border,
                            }}
                        >
                            {plan.popular && (
                                <div className="popular-badge" style={{ backgroundColor: c.solarFlare, color: c.void }}>
                                    Most popular
                                </div>
                            )}

                            <div className="plan-icon" style={{ color: c.solarFlare }}>{plan.icon}</div>
                            <h3 className="plan-name" style={{ color: plan.popular ? c.void : c.starlight }}>{plan.name}</h3>
                            <p className="plan-tagline" style={{ color: plan.popular ? c.distant : c.moonlight }}>{plan.tagline}</p>

                            <div className="plan-price">
                                <span className="price-currency" style={{ color: plan.popular ? c.distant : c.moonlight }}>$</span>
                                <span className="price-amount" style={{ color: plan.popular ? c.void : c.starlight }}>
                                    {isYearly ? plan.priceYearly : plan.priceMonthly}
                                </span>
                                <span className="price-period" style={{ color: plan.popular ? c.distant : c.moonlight }}>/mo</span>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <span className="feature-check" style={{ color: c.solarFlare }}>✓</span>
                                        <span style={{ color: plan.popular ? c.distant : c.moonlight }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`plan-cta ${plan.popular ? 'primary' : 'secondary'}`}
                                style={{
                                    backgroundColor: plan.popular ? c.solarFlare : 'transparent',
                                    color: plan.popular ? c.void : c.starlight,
                                    borderColor: plan.popular ? c.solarFlare : c.border,
                                }}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Enterprise */}
                <div className="enterprise-banner" style={{ backgroundColor: c.nebula, borderColor: c.border }}>
                    <div className="enterprise-content">
                        <span className="enterprise-icon">🏛</span>
                        <div>
                            <h4 style={{ color: c.starlight }}>Enterprise & Education</h4>
                            <p style={{ color: c.moonlight }}>Custom plans for universities, bootcamps, and large teams.</p>
                        </div>
                    </div>
                    <button className="btn-ghost" style={{ color: c.starlight, borderColor: c.border }}>
                        Get in touch
                    </button>
                </div>
            </div>
        </section>
    );
});

Pricing.displayName = 'Pricing';
