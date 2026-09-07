import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  getMyApplications,
} from "@/services/applications.service";

import type {
  Application,
} from "@/types/applications";

import "@/styles/candidate-applications.css";

export const Route = createFileRoute(
  "/candidate/applications",
)({
  component:
    CandidateApplicationsPage,
});

function CandidateApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMyApplications();

      setApplications(
        response.data,
      );
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your applications.",
      );
    } finally {
      setLoading(false);
    }
  }

  function formatStatus(
    status: string,
  ) {
    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  }

  function formatDate(
    date: string,
  ) {
    return new Date(
      date,
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  if (loading) {
    return (
      <main className="candidate-applications-page">
        <section className="candidate-applications-container">
          <div className="candidate-loading">
            <div className="candidate-spinner" />

            <p>
              Loading your applications...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="candidate-applications-page">
      <section className="candidate-applications-container">

        <header className="candidate-applications-header">
          <div>
            <p className="candidate-eyebrow">
              CANDIDATE PORTAL
            </p>

            <h1>
              My Applications
            </h1>

            <p>
              View and track the applications
              you have submitted.
            </p>
          </div>

          <Link
            to="/jobs"
            className="candidate-browse-jobs"
          >
            Browse Jobs
          </Link>
        </header>

        {error && (
          <div
            className="candidate-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!error &&
          applications.length === 0 && (
            <div className="candidate-empty">
              <div className="candidate-empty-icon">
                📄
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You have not submitted
                any job applications yet.
              </p>

              <Link
                to="/jobs"
                className="candidate-browse-jobs"
              >
                Browse Available Jobs
              </Link>
            </div>
          )}

        {applications.length > 0 && (
          <div className="candidate-applications-list">

            {applications.map(
              (application) => (
                <article
                  key={application.id}
                  className="candidate-application-card"
                >
                  <div className="candidate-application-main">

                    <div className="candidate-application-icon">
                      {application.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="candidate-application-info">

                      <h2>
                        {application.jobTitle ??
                          `Job #${application.jobId}`}
                      </h2>

                      <p>
                        {application.fullName}
                      </p>

                      <span>
                        Applied on{" "}
                        {formatDate(
                          application.createdAt,
                        )}
                      </span>

                    </div>

                    <span
                      className={`candidate-status-badge ${application.status}`}
                    >
                      {formatStatus(
                        application.status,
                      )}
                    </span>

                  </div>

                  <div className="candidate-application-details">

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {application.email}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {application.phone}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Resume
                      </span>

                      <strong>
                        {application.resumeName}
                      </strong>
                    </div>

                  </div>

                  {application.resumeUrl && (
                    <div className="candidate-application-actions">
                      <a
                        href={
                          application.resumeUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candidate-view-cv"
                      >
                        View CV
                      </a>
                    </div>
                  )}

                </article>
              ),
            )}

          </div>
        )}

      </section>
    </main>
  );
}