import {
  getScreeningDecision,
  saveScreeningDecision,
} from "@/services/screening.service";
import {
  createFileRoute,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type {
  ScreeningDecision,
  ScreeningDecisionResponse,
} from "@/types/screening";

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
      <div className="flex justify-center items-center min-h-screen">
        Loading...
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

      alert("Saved successfully");
    } catch (error) {
      console.error("Failed to save:", error);

      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Screening Decision
      </h1>


      {decision && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-2">

          <p>
            <strong>Decision:</strong>{" "}
            {decision.decision}
          </p>

          <p>
            <strong>Note:</strong>{" "}
            {decision.note}
          </p>

          <p>
            <strong>Updated:</strong>{" "}
            {decision.updatedAt}
          </p>

        </div>
      )}


      <div className="border rounded-lg p-5 space-y-4">

        <h2 className="text-xl font-semibold">
          Update Decision
        </h2>


        <div>
          <label className="font-medium">
            Note
          </label>

          <textarea
            className="w-full border rounded-md p-3 mt-2"
            rows={5}
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            placeholder="Write screening note..."
          />
        </div>


        <div>
          <label className="font-medium">
            Decision
          </label>

          <select
            className="w-full border rounded-md p-2 mt-2"
            value={decisionValue}
            onChange={(e) =>
              setDecisionValue(
                e.target.value as ScreeningDecision
              )
            }
          >
            <option value="pass">
              Pass
            </option>

            <option value="hold">
              Hold
            </option>

            <option value="reject">
              Reject
            </option>

          </select>
        </div>


        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-50"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </button>

      </div>

    </div>
  );
}