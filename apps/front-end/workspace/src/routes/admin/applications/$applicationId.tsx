import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  getApplicationById,
  updateApplicationStatus,
} from "@/services/applications.service";

import type {
  Application,
} from "@/types/applications";

import "@/styles/admin-screening.css";

export const Route = createFileRoute(
  "/admin/applications/$applicationId",
)({
  component: CandidateDetailsPage,
});

function CandidateDetailsPage() {
  const { applicationId } =
    Route.useParams();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function loadApplication() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getApplicationById(
          Number(applicationId),
        );

      setApplication(response.data);
    } catch (error) {
      console.error(
        "Failed to load application:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load application.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(
    status:
      | "approved"
      | "rejected",
  ) {
    try {
      setUpdating(true);
      setError("");

      const response =
        await updateApplicationStatus(
          Number(applicationId),
          status,
        );

      setApplication(response.data);
    } catch (error) {
      console.error(
        "Failed to update status:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application status.",
      );
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <main className="admin-screening-page">
        <div className="admin-loading">
          <div className="admin-spinner" />

          <p>
            Loading candidate...
          </p>
        </div>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="admin-screening-page">
        <section className="admin-screening-container">
          <div className="admin-empty-state">
            <h2>
              Application not found
            </h2>

            <p>
              {error ||
                "The requested application does not exist."}
            </p>

            <Link
              to="/admin/applications"
              className="admin-back-button"
            >
              Back to applications
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-screening-page">
      <section className="admin-screening-container">

        <header className="candidate-details-header">
          <div>

            <Link
              to="/admin/screening"
              className="candidate-back-link"
            >
              ← Back to screening
            </Link>

            <p className="admin-eyebrow">
              CANDIDATE APPLICATION
            </p>

            <h1>
              Candidate Details
            </h1>

            <p>
              Review the candidate information
              and update the application status.
            </p>

          </div>
        </header>

        {error && (
          <div
            className="admin-action-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="candidate-card">

          {/* Candidate Header */}
          <div className="candidate-card-top">

            <div className="candidate-avatar">
              {application.fullName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2>
                {application.fullName}
              </h2>

              <p>
                {application.jobTitle ??
                  `Job #${application.jobId}`}
              </p>
            </div>

            <span
              className={`status-badge ${application.status}`}
            >
              {formatStatus(
                application.status,
              )}
            </span>

          </div>

          {/* Candidate Information */}
          <div className="candidate-details-grid">

            <div className="candidate-detail-item">
              <span>
                Email
              </span>

              <strong>
                {application.email}
              </strong>
            </div>

            <div className="candidate-detail-item">
              <span>
                Phone
              </span>

              <strong>
                {application.phone}
              </strong>
            </div>

            <div className="candidate-detail-item">
              <span>
                Position
              </span>

              <strong>
                {application.jobTitle ??
                  `Job #${application.jobId}`}
              </strong>
            </div>

            {/* CV */}
            <div className="candidate-detail-item resume-item">

              <span>
                Resume
              </span>

              <strong>
                {application.resumeName}
              </strong>

            </div>

          </div>

          {/* CV Preview */}
          {application.resumeUrl ? (
            <div className="cv-preview-section">

              <h3>
                CV Preview
              </h3>

              <iframe
                src={application.resumeUrl}
                title={`${application.fullName}'s CV`}
                className="cv-preview-iframe"
              />

              <div className="cv-preview-actions">

                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-cv-button"
                >
                  Open CV in New Tab
                </a>

              </div>

            </div>
          ) : (
            <div className="cv-not-available">
              <p>
                CV not available.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="candidate-actions">

            <button
              type="button"
              className="approve-button"
              disabled={updating}
              onClick={() =>
                changeStatus("approved")
              }
            >
              {updating
                ? "Updating..."
                : "Approve Candidate"}
            </button>

            <button
              type="button"
              className="reject-button"
              disabled={updating}
              onClick={() =>
                changeStatus("rejected")
              }
            >
              {updating
                ? "Updating..."
                : "Reject Candidate"}
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}