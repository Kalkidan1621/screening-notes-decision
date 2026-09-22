import OpenAI from "openai";
import { getActiveJobs } from "../../services/jobs.js";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}

const openai = new OpenAI({
  apiKey,
});

const MODEL = "gpt-5.6-luna";

export type TelegramAIResult = {
  answer: string;
  jobIds: number[];
};

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

  const response = await openai.responses.create({
    model: MODEL,
    instructions: `
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
    `.trim(),
    input: `
CURRENT ACTIVE JOBS:

${jobContext || "There are currently no active jobs."}

USER QUESTION:

${question}
    `.trim(),
  });

  const rawAnswer = response.output_text?.trim();

  if (!rawAnswer) {
    return {
      answer:
        "Sorry, I could not generate an answer right now. Please try again.",
      jobIds: [],
    };
  }

  try {
    const parsed = JSON.parse(rawAnswer) as TelegramAIResult;

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
      "[Telegram AI] Failed to parse AI response:",
      error,
    );

    return {
      answer: rawAnswer,
      jobIds: [],
    };
  }
}