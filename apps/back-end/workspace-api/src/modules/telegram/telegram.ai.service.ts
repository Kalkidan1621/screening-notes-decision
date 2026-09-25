import { GoogleGenAI } from "@google/genai";
import { getActiveJobs } from "../../services/jobs.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const PRIMARY_MODEL = "gemini-3.8-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";

export type TelegramAIResult = {
  answer: string;
  jobIds: number[];
};

function getStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    return Number(
      (error as { status?: unknown }).status,
    );
  }

  return undefined;
}

async function generateWithRetry(
  model: string,
  prompt: string,
): Promise<string> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawAnswer = response.text?.trim();

      if (!rawAnswer) {
        throw new Error(
          `Gemini returned an empty response using ${model}`,
        );
      }

      return rawAnswer;
    } catch (error) {
      const status = getStatus(error);

      if (status !== 503 || attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt * 3000;

      console.warn(
        `[Telegram AI] ${model} temporarily unavailable. ` +
          `Retrying in ${delay / 1000}s (${attempt}/${maxAttempts})...`,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay),
      );
    }
  }

  throw new Error(
    `Gemini did not return a response using ${model}`,
  );
}

export async function askTelegramAI(
  question: string,
): Promise<TelegramAIResult> {
  const jobs = await getActiveJobs();

  const jobContext = jobs
    .map((job) => {
      return [
        `Job ID: ${job.id}`,
        `Title: ${job.title}`,
        `Employer: ${job.employer}`,
        `Department: ${job.department}`,
        `Location: ${job.location}`,
        `Employment Type: ${job.employmentType}`,
        `Working Time: ${job.workingTime}`,
        `Experience: ${job.experience}`,
        `Educational Qualification: ${job.educationalQualification}`,
        `Salary: ${job.salary}`,
        `Opening Date: ${job.openingDate}`,
        `Closing Date: ${job.closingDate}`,
        `Description: ${job.description}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");

  const prompt = `
You are the AI assistant for a professional Job Portal Telegram bot.

Your job is to help users understand and find currently available jobs.

IMPORTANT RULES:
1. Use only the provided active-job data as the source of truth for job-specific information.
2. Never invent a job, employer, salary, requirement, location, or deadline.
3. If the requested information is not available, clearly say so.
4. You may provide general career and application guidance.
5. Keep the answer concise and easy to read on Telegram.
6. When recommending jobs, explain briefly why each job may match the user's question.
7. Do not make hiring decisions.
8. Do not claim that a user is guaranteed to get a job.
9. Only return job IDs that actually exist in the provided active-job data.
10. If no job is relevant, return an empty jobIds array.
11. Return ONLY valid JSON.
12. The JSON must have exactly these fields:
    - answer: string
    - jobIds: number[]

CURRENT ACTIVE JOBS:

${jobContext || "There are currently no active jobs."}

USER QUESTION:

${question}
`.trim();

  try {
    let rawAnswer: string;

    try {
      console.log(
        `[Telegram AI] Trying primary model: ${PRIMARY_MODEL}`,
      );

      rawAnswer = await generateWithRetry(
        PRIMARY_MODEL,
        prompt,
      );
    } catch (primaryError) {
      const primaryStatus = getStatus(primaryError);

      console.warn(
        `[Telegram AI] Primary model failed ` +
          `(status: ${primaryStatus ?? "unknown"}). ` +
          `Trying fallback model: ${FALLBACK_MODEL}`,
      );

      rawAnswer = await generateWithRetry(
        FALLBACK_MODEL,
        prompt,
      );
    }

    try {
      const parsed = JSON.parse(
        rawAnswer,
      ) as TelegramAIResult;

      const validJobIds = new Set(
        jobs.map((job) => Number(job.id)),
      );

      const jobIds = Array.isArray(parsed.jobIds)
        ? parsed.jobIds
            .map(Number)
            .filter((id) => validJobIds.has(id))
        : [];

      return {
        answer:
          typeof parsed.answer === "string" &&
          parsed.answer.trim()
            ? parsed.answer.trim()
            : "I could not find a suitable answer.",
        jobIds,
      };
    } catch (error) {
      console.error(
        "[Telegram AI] Failed to parse Gemini response:",
        error,
      );

      return {
        answer: rawAnswer,
        jobIds: [],
      };
    }
  } catch (error) {
    console.error(
      "[Telegram AI] All Gemini models failed:",
      error,
    );

    return {
      answer:
        "🤖 The AI assistant is temporarily unavailable. Please try again shortly.",
      jobIds: [],
    };
  }
}