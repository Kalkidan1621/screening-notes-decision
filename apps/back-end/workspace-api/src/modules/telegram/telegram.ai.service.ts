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

export async function askTelegramAI(question: string): Promise<string> {
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
1. Use the provided active-job data as the source of truth for job-specific information.
2. Never invent a job, employer, salary, requirement, location, or deadline.
3. If the requested information is not available in the job data, clearly say that it is not available.
4. You may give general career or application guidance when appropriate.
5. Keep answers concise and easy to read on Telegram.
6. When recommending jobs, explain briefly why they may match the user's stated background or preference.
7. Do not make hiring decisions.
8. Do not claim that a user is guaranteed to get a job.
9. If there are no matching jobs, say so clearly and suggest checking other available jobs.
10. Use plain text. Do not use markdown tables.
    `.trim(),
    input: `
CURRENT ACTIVE JOBS:

${jobContext || "There are currently no active jobs."}

USER QUESTION:

${question}
    `.trim(),
  });

  const answer = response.output_text?.trim();

  if (!answer) {
    return "Sorry, I could not generate an answer right now. Please try again.";
  }

  return answer;
}