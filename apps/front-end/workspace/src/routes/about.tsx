import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import "@/styles/about.css";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <span className="about-eyebrow">
            ABOUT MUYALOGY RECRUITMENT
          </span>

          <h1>
            Connecting talented people
            with the right opportunities.
          </h1>

          <p>
            Muyalogy Recruitment provides a professional
            platform for discovering jobs, applying for
            opportunities, and managing the recruitment
            process in one place.
          </p>

          <div className="about-actions">
            <Link
              to="/jobs"
              className="about-primary-button"
            >
              Explore Jobs
            </Link>

            <Link
              to="/"
              className="about-secondary-button"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <div className="about-section-heading">
            <span>OUR PLATFORM</span>

            <h2>
              A simpler recruitment experience
            </h2>

            <p>
              Our platform is designed to make the
              recruitment journey clear, efficient,
              and accessible for both candidates and
              employers.
            </p>
          </div>

          <div className="about-feature-grid">
            <article className="about-feature-card">
              <div className="about-feature-icon">
                01
              </div>

              <h3>Discover Opportunities</h3>

              <p>
                Browse available jobs and find
                opportunities that match your skills,
                experience, and career goals.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">
                02
              </div>

              <h3>Apply Easily</h3>

              <p>
                Submit your application and CV through
                a simple and professional application
                process.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">
                03
              </div>

              <h3>Track Your Progress</h3>

              <p>
                Follow your application progress from
                initial screening through interviews
                and hiring decisions.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}