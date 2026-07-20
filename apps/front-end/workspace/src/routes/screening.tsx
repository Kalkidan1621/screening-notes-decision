import {
  getScreeningDecision,
  saveScreeningDecision,
} from "@/services/screening.service";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type {
  ScreeningDecision,
  ScreeningDecisionResponse,
} from "@/types/screening";

import "@/styles/screening.css";

export const Route = createFileRoute("/screening")({
  component: RouteComponent,
});

function RouteComponent() {
  const [decision, setDecision] =
    useState<ScreeningDecisionResponse["data"]>(null);

  const [note, setNote] = useState("");

  const [decisionValue, setDecisionValue] =
    useState<ScreeningDecision>("pass");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDecision() {
      try {
        const response = await getScreeningDecision("test");

        setDecision(response.data);

        if (response.data) {
          setNote(response.data.note);
          setDecisionValue(response.data.decision);
        }
      } catch (error) {
        console.error("Failed to fetch decision:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDecision();
  }, []);

  if (loading) {
    return (
      <div className="screening-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  async function handleSave() {
    try {
      setSaving(true);

      const result = await saveScreeningDecision("test", {
        decision: decisionValue,
        note,
      });

      setDecision(result.data);

      alert("Decision saved successfully");
    } catch (error) {
      console.error("Failed to save:", error);

      alert("Failed to save decision");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screening-page">

      {/* Header */}
      <div className="page-header">

        <div>
          <p className="page-label">
            CANDIDATE SCREENING
          </p>

          <h1>
            Screening Decision
          </h1>

          <p className="page-description">
            Review the candidate and record your screening decision.
          </p>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Screening Active
        </div>

      </div>


      <div className="screening-layout">

        {/* Saved Decision */}
        <div className="decision-card">

          <div className="card-header">

            <div>
              <h2>
                Current Decision
              </h2>

              <p>
                Latest screening information
              </p>
            </div>

            <div className={`decision-badge ${decision?.decision || "empty"}`}>
              {decision?.decision || "Not set"}
            </div>

          </div>


          {decision ? (
            <div className="decision-content">

              <div className="info-row">
                <span className="info-label">
                  Decision
                </span>

                <span className={`decision-text ${decision.decision}`}>
                  {decision.decision}
                </span>
              </div>


              <div className="info-row note-row">
                <span className="info-label">
                  Screening Note
                </span>

                <p className="saved-note">
                  {decision.note || "No note added"}
                </p>
              </div>


              <div className="info-row">
                <span className="info-label">
                  Last Updated
                </span>

                <span className="updated-time">
                  {decision.updatedAt}
                </span>
              </div>

            </div>
          ) : (
            <div className="empty-state">

              <div className="empty-icon">
                !
              </div>

              <h3>
                No decision yet
              </h3>

              <p>
                Add a screening decision using the form.
              </p>

            </div>
          )}

        </div>


        {/* Update Decision */}
        <div className="decision-card form-card">

          <div className="card-header">

            <div>
              <h2>
                Update Decision
              </h2>

              <p>
                Record your assessment of the candidate.
              </p>
            </div>

          </div>


          <div className="form-content">

            {/* Decision Options */}
            <div className="form-group">

              <label>
                Screening Decision
              </label>

              <div className="decision-options">

                <button
                  type="button"
                  className={`decision-option pass ${
                    decisionValue === "pass" ? "selected" : ""
                  }`}
                  onClick={() => setDecisionValue("pass")}
                >
                  <span className="option-icon">
                    ✓
                  </span>

                  <span>
                    <strong>Pass</strong>
                    <small>Move candidate forward</small>
                  </span>
                </button>


                <button
                  type="button"
                  className={`decision-option hold ${
                    decisionValue === "hold" ? "selected" : ""
                  }`}
                  onClick={() => setDecisionValue("hold")}
                >
                  <span className="option-icon">
                    ⏸
                  </span>

                  <span>
                    <strong>Hold</strong>
                    <small>Review again later</small>
                  </span>
                </button>


                <button
                  type="button"
                  className={`decision-option reject ${
                    decisionValue === "reject" ? "selected" : ""
                  }`}
                  onClick={() => setDecisionValue("reject")}
                >
                  <span className="option-icon">
                    ×
                  </span>

                  <span>
                    <strong>Reject</strong>
                    <small>Do not move forward</small>
                  </span>
                </button>

              </div>

            </div>


            {/* Note */}
            <div className="form-group">

              <div className="label-row">

                <label>
                  Screening Note
                </label>

                <span className="character-count">
                  {note.length}/1000
                </span>

              </div>


              <textarea
                rows={6}
                maxLength={1000}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Write your screening notes here..."
              />

              <p className="input-hint">
                Add relevant observations about the candidate's skills,
                experience, and suitability for the role.
              </p>

            </div>


            {/* Save */}
            <button
              className="save-button"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  Save Decision
                  <span className="button-arrow">
                    →
                  </span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
