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
You are the AI Job Assistant for a professional recruitment Job Portal Telegram bot.

Your task is to understand the user's request and recommend ONLY relevant jobs from the CURRENT ACTIVE JOBS data.

STRICT RULES:

1. Use ONLY the provided active-job data for job-specific information.
2. NEVER invent a job, employer, salary, requirement, location, experience, education, or deadline.
3. If the user asks which jobs match their education and experience, compare their profile against the job's:
   - Educational Qualification
   - Experience
   - Department
   - Job Title
   - Description
   - Requirements
4. Recommend a job ONLY when there is a clear and reasonable match.
5. Do NOT recommend jobs simply because the user's education could technically be accepted.
6. Relevant work experience is important. Prefer jobs where the user's experience level is appropriate.
7. If the user's degree is Accounting and the job is unrelated to accounting, do NOT recommend it unless the job requirements clearly make it relevant.
8. Do NOT recommend a Store Keeper, Receptionist, Sales Representative, Marketing Officer, HR Officer, etc. just because the user's degree may technically satisfy a generic education requirement.
9. When the user asks for jobs matching their profile, return ONLY the matching job IDs in jobIds.
10. Do NOT list all active jobs in the answer.
11. Do NOT repeat the complete active-job list in the answer.
12. If only one job clearly matches, recommend only that job.
13. If no job clearly matches, return an empty jobIds array and explain that no current active job clearly matches.
14. Do not make hiring decisions.
15. Do not claim that the user is guaranteed to get a job.
16. Keep the answer concise and professional for Telegram.
17. When recommending jobs, briefly explain WHY each recommended job matches.
18. The bot will display the full job details separately, so do NOT repeat salary, location, employer, education, or closing date in the answer unless necessary.
19. Return ONLY valid JSON.
20. The JSON must have exactly these fields:
   - answer: string
   - jobIds: number[]
21. If the user asks "which jobs match me", "what jobs fit me", "which jobs can I apply for", or provides their degree and experience, treat the request as a JOB MATCHING request, NOT as a request to list all active jobs.

IMPORTANT MATCHING LOGIC:

For a user with:
- Bachelor's degree in Accounting
- 2 years of experience

A job such as:
- Accountant
- Senior Accountant
- Accounting Officer
- Finance-related position

may be relevant if its requirements match the user's education and experience.

A job such as:
- Store Keeper
- Receptionist
- Sales Representative
- Marketing Officer
- HR Officer
- Frontend Developer
- Backend Developer

should NOT be recommended merely because the user's degree could technically satisfy a generic educational requirement.

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