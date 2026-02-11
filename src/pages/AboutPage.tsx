import { useOutletContext, Link } from 'react-router-dom';
import type { LayoutContext } from '../types/theme';
import { CosmicOrb } from '../components';

export function AboutPage() {
  const { c, isDark } = useOutletContext<LayoutContext>();

  const beliefs = [
    {
      icon: '\u26A1',
      title: 'Speed of thought',
      description:
        'Learning should never wait on loading screens. NoteCase captures your ideas the instant they form, so momentum is never broken.',
    },
    {
      icon: '\uD83D\uDD2D',
      title: 'Curiosity-first',
      description:
        'We design for the spark, not the syllabus. Every feature exists to help you follow a question wherever it leads.',
    },
    {
      icon: '\u221E',
      title: 'Boundless depth',
      description:
        'Surface-level knowledge fades. Noteshell helps you build layered understanding that compounds over time.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="about-hero" style={{ position: 'relative' }}>
        <CosmicOrb size={500} x={80} y={30} isDark={isDark} accent />
        <CosmicOrb size={350} x={10} y={60} isDark={isDark} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="hero-tag"
            style={{ borderColor: c.border, color: c.moonlight }}
          >
            <span className="pulse-dot" style={{ backgroundColor: c.solarFlare }} />
            OUR MISSION
          </span>

          <h1 className="about-headline" style={{ color: c.starlight }}>
            Learning should feel like{' '}
            <em className="headline-accent" style={{ color: c.solarFlare }}>
              discovery
            </em>
          </h1>

          <p className="about-subtitle" style={{ color: c.moonlight }}>
            We started Noteshell because the best ideas show up when curiosity flows. 
            Our mission is to build the fastest, most intuitive tool for thinking and learning.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="about-mission" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="mission-divider" style={{ backgroundColor: c.solarFlare }} />

          <blockquote className="mission-quote" style={{ color: c.starlight }}>
            "We imagine learning with a partner that never forgets, always connects the dots, and quietly keeps you moving forward."
          </blockquote>

          <p className="mission-body" style={{ color: c.moonlight }}>
            Traditional note-taking tools treat knowledge like static files.
            Noteshell treats it like a living constellation — each idea a star,
            every connection a line of light. We are building software that
            thinks alongside you, so you can spend less time organizing and
            more time understanding.
          </p>
        </div>
      </section>

      {/* Beliefs */}
      <section className="about-beliefs" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag" style={{ color: c.solarFlare }}>
              WHAT WE BELIEVE
            </span>
            <h2 style={{ color: c.starlight }}>Principles that guide us</h2>
          </div>

          <div className="beliefs-grid">
            {beliefs.map((b) => (
              <div
                key={b.title}
                className="belief-card"
                style={{
                  backgroundColor: c.nebula,
                  borderColor: c.border,
                  color: c.starlight,
                }}
              >
                <span className="belief-icon">{b.icon}</span>
                <h3 className="belief-title" style={{ color: c.starlight }}>
                  {b.title}
                </h3>
                <p className="belief-description" style={{ color: c.moonlight }}>
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ position: 'relative' }}>
        <CosmicOrb size={400} x={50} y={50} isDark={isDark} accent />

        <div className="cta-content" style={{ position: 'relative', zIndex: 1 }}>
          <span className="cta-badge" style={{ borderColor: c.border, color: c.moonlight }}>
            Join the journey
          </span>
          <h2 style={{ color: c.starlight }}>
            Ready to think <em style={{ color: c.solarFlare }}>differently</em>?
          </h2>
          <p style={{ color: c.moonlight }}>
            Noteshell is currently in early access. Sign up to be among the
            first to experience a new way of learning.
          </p>
          <div className="cta-buttons">
            <Link
              to="https://docs.google.com/forms/d/e/1FAIpQLSfyEoHmFAXD0plWwSXWNrm6PYz4QYSThChYDGvr4k67cPlzKQ/viewform"
              className="btn-primary"
              style={{
                backgroundColor: c.solarFlare,
                color: isDark ? '#000' : '#fff',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Waitlist <span className="btn-arrow">→</span>
            </Link>
            <Link
              to="/"
              className="btn-ghost"
              style={{ borderColor: c.border, color: c.starlight }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
