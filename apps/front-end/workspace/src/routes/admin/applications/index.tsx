import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  getAllApplications,
} from "@/services/applications.service";

import type {
  Application,
} from "@/types/applications";

export const Route = createFileRoute(
  "/admin/applications/",
)({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAllApplications();

        setApplications(response.data);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load applications.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Applications List</h1>

        <p>
          Loading applications...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Applications List</h1>

        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>
        Applications List
      </h1>

      {applications.length === 0 ? (
        <p>
          No applications found.
        </p>
      ) : (
        <div>
          {applications.map(
            (application) => (
              <article
                key={application.id}
                style={{
                  marginBottom: "30px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h2>
                  {application.fullName}
                </h2>

                <p>
                  Email:{" "}
                  {application.email}
                </p>

                <p>
                  Phone:{" "}
                  {application.phone}
                </p>

                <p>
                  Job:{" "}
                  {application.jobTitle ??
                    "Unknown job"}
                </p>

                <p>
                  Status:{" "}
                  {application.status}
                </p>

                <div>
                  <strong>
                    CV:
                  </strong>

                  {application.resumeUrl ? (
                    <>
                      <iframe
                        src={
                          application.resumeUrl
                        }
                        title={`${application.fullName}'s CV`}
                        width="100%"
                        height="700"
                        style={{
                          border:
                            "1px solid #ddd",
                          borderRadius:
                            "8px",
                          marginTop:
                            "10px",
                        }}
                      />

                      <div
                        style={{
                          marginTop:
                            "10px",
                        }}
                      >
                        <a
                          href={
                            application.resumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "10px 16px",
                            backgroundColor:
                              "#2563eb",
                            color: "white",
                            textDecoration:
                              "none",
                            borderRadius:
                              "6px",
                            fontWeight:
                              "600",
                          }}
                        >
                          Open CV in New Tab
                        </a>
                      </div>
                    </>
                  ) : (
                    <p>
                      CV not available.
                    </p>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </main>
  );
}