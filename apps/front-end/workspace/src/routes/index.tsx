import { createFileRoute, Link } from "@tanstack/react-router";

import "@/styles/home.css";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-container">
          <div className="home-hero-content">
            <span className="home-eyebrow">
              MUYALOGY RECRUITMENT
            </span>

            <h1>
              Find the Right
              <span> Opportunity.</span>
              <br />
              Build Your Future.
            </h1>

            <p>
              Discover meaningful career opportunities,
              connect with trusted employers, and take
              the next step toward your professional future.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/jobs"
                className="home-primary-button"
              >
                Browse Jobs
                <span>→</span>
              </Link>

              <Link
                to="/about"
                className="home-secondary-button"
              >
                Learn More
              </Link>
            </div>

            <div className="home-hero-trust">
              <div className="home-trust-item">
                <strong>Professional</strong>
                <span>Recruitment Platform</span>
              </div>

              <div className="home-trust-divider" />

              <div className="home-trust-item">
                <strong>Trusted</strong>
                <span>Employer Connections</span>
              </div>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-image-wrapper">
              <img
                src="/images/home-hero-office.png"
                alt="Professional recruitment"
                className="home-hero-image"
              />

              <div className="home-hero-floating-card home-hero-card-top">
                <div className="home-floating-icon">
                  ✓
                </div>
                <div>
                  <strong>Career Opportunities</strong>
                  <span>Find your next opportunity</span>
                </div>
              </div>

              <div className="home-hero-floating-card home-hero-card-bottom">
                <div className="home-floating-stat">
                  <strong>01</strong>
                  <span>Find</span>
                </div>

                <div className="home-floating-stat">
                  <strong>02</strong>
                  <span>Apply</span>
                </div>

                <div className="home-floating-stat">
                  <strong>03</strong>
                  <span>Grow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-section home-why-section">
        <div className="home-section-container">
          <div className="home-section-heading">
            <span>WHY MUYALOGY</span>

            <h2>
              A better way to find
              <br />
              your next opportunity.
            </h2>

            <p>
              We make the recruitment journey simpler,
              clearer, and more professional for both
              candidates and employers.
            </p>
          </div>

          <div className="home-benefits">
            <article className="home-benefit-card">
              <div className="home-benefit-number">
                01
              </div>

              <div className="home-benefit-icon">
                ◇
              </div>

              <h3>Trusted Opportunities</h3>

              <p>
                Explore opportunities from employers
                looking for qualified and motivated
                professionals.
              </p>
            </article>

            <article className="home-benefit-card">
              <div className="home-benefit-number">
                02
              </div>

              <div className="home-benefit-icon">
                ✓
              </div>

              <h3>Simple Application</h3>

              <p>
                Find a suitable position and complete
                your application through a clear and
                straightforward process.
              </p>
            </article>

            <article className="home-benefit-card">
              <div className="home-benefit-number">
                03
              </div>

              <div className="home-benefit-icon">
                ↗
              </div>

              <h3>Career Growth</h3>

              <p>
                Move forward with opportunities that
                match your skills, experience, and
                professional goals.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section home-process-section">
        <div className="home-section-container">
          <div className="home-process-heading">
            <div>
              <span>HOW IT WORKS</span>

              <h2>
                Your journey starts here.
              </h2>
            </div>

            <p>
              From discovering an opportunity to
              progressing through recruitment, we keep
              the process organized and transparent.
            </p>
          </div>

          <div className="home-process">
            <div className="home-process-step">
              <div className="home-process-circle">
                01
              </div>

              <div>
                <h3>Explore</h3>
                <p>
                  Browse available job opportunities
                  and find positions that match your
                  career goals.
                </p>
              </div>
            </div>

            <div className="home-process-line" />

            <div className="home-process-step">
              <div className="home-process-circle">
                02
              </div>

              <div>
                <h3>Apply</h3>
                <p>
                  Submit your application and provide
                  the information needed for the
                  recruitment process.
                </p>
              </div>
            </div>

            <div className="home-process-line" />

            <div className="home-process-step">
              <div className="home-process-circle">
                03
              </div>

              <div>
                <h3>Progress</h3>
                <p>
                  Track your application as it moves
                  through the recruitment process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate / Employer */}
      <section className="home-section home-audience-section">
        <div className="home-section-container">
          <div className="home-audience-grid">
            <article className="home-audience-card home-audience-candidate">
              <span>FOR CANDIDATES</span>

              <h2>
                Take the next step
                in your career.
              </h2>

              <p>
                Discover opportunities, apply for
                positions, and keep track of your
                recruitment journey from one place.
              </p>

              <Link
                to="/jobs"
                className="home-audience-link"
              >
                Explore Opportunities
                <span>→</span>
              </Link>
            </article>

            <article className="home-audience-card home-audience-employer">
              <span>FOR EMPLOYERS</span>

              <h2>
                Find people who
                move your business forward.
              </h2>

              <p>
                Connect with qualified candidates and
                manage your recruitment process through
                a structured platform.
              </p>

              <Link
                to="/about"
                className="home-audience-link"
              >
                Learn About Muyalogy
                <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="home-cta-section">
        <div className="home-cta-container">
          <div>
            <span>YOUR NEXT STEP</span>

            <h2>
              Ready for your next opportunity?
            </h2>

            <p>
              Explore available positions and start
              your journey today.
            </p>
          </div>

          <Link
            to="/jobs"
            className="home-cta-button"
          >
            Explore Jobs
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}