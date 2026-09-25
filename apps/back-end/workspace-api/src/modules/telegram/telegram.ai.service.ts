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

/**
 * Extract user's years of experience from natural language.
 *
 * Examples:
 * "2 years experience" -> 2
 * "I have 3 years of experience" -> 3
 * "with 1.5 years experience" -> 1.5
 */
function extractYearsOfExperience(
  question: string,
): number | null {
  const match = question.match(
    /(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience)?/i,
  );

  if (!match) {
    return null;
  }

  const years = Number(match[1]);

  return Number.isFinite(years) ? years : null;
}

/**
 * Normalize experience text.
 */
function normalizeExperience(
  experience: string,
): string {
  return experience
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check whether user's experience satisfies
 * the job's stated experience requirement.
 */
function experienceMatches(
  userYears: number,
  requirement: string,
): boolean {
  const normalized = normalizeExperience(requirement);

  // Fresh Graduate
  if (
    normalized.includes("fresh graduate") ||
    normalized.includes("freshgraduate")
  ) {
    return userYears === 0;
  }

  // No experience
  if (
    normalized === "no experience" ||
    normalized.includes("no experience required") ||
    normalized.includes("no experience needed")
  ) {
    return userYears === 0;
  }

  // Range: 0-1, 1-2, 2-3, 3-5, etc.
  const rangeMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/,
  );

  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);

    return userYears >= min && userYears <= max;
  }

  // 2+, 3+, etc.
  const plusMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*\+/,
  );

  if (plusMatch) {
    const minimum = Number(plusMatch[1]);

    return userYears >= minimum;
  }

  // "2 years" exactly
  const exactMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/,
  );

  if (exactMatch) {
    const requiredYears = Number(exactMatch[1]);

    return userYears === requiredYears;
  }

  return false;
}

/**
 * Extract likely education/degree information from
 * the user's question.
 */
function extractEducation(
  question: string,
): string {
  const normalized = question.toLowerCase();

  const educationKeywords = [
    "accounting",
    "accountancy",
    "finance",
    "financial management",
    "computer science",
    "computer engineering",
    "software engineering",
    "information technology",
    "information systems",
    "business administration",
    "business management",
    "marketing",
    "human resource",
    "human resources",
    "hr",
    "economics",
    "management",
    "statistics",
    "mathematics",
    "engineering",
  ];

  const found = educationKeywords.filter((keyword) =>
    normalized.includes(keyword),
  );

  return found.join(" ");
}

/**
 * Check whether the job explicitly accepts the user's
 * education.
 *
 * We intentionally use the DB educational qualification
 * text instead of the job title.
 */
function educationMatches(
  userEducation: string,
  jobEducation: string,
): boolean {
  if (!userEducation.trim()) {
    return false;
  }

  const user = userEducation.toLowerCase();
  const job = jobEducation.toLowerCase();

  const educationAliases: Record<
    string,
    string[]
  > = {
    accounting: [
      "accounting",
      "accountancy",
    ],

    accountancy: [
      "accounting",
      "accountancy",
    ],

    finance: [
      "finance",
      "financial management",
      "accounting",
      "accountancy",
    ],

    "financial management": [
      "finance",
      "financial management",
      "accounting",
      "accountancy",
    ],

    "computer science": [
      "computer science",
      "software engineering",
      "computer engineering",
    ],

    "software engineering": [
      "software engineering",
      "computer science",
      "computer engineering",
    ],

    "computer engineering": [
      "computer engineering",
      "computer science",
      "software engineering",
    ],

    "information technology": [
      "information technology",
      "information systems",
      "computer science",
    ],

    "information systems": [
      "information systems",
      "information technology",
      "computer science",
    ],

    "business administration": [
      "business administration",
      "business management",
    ],

    "business management": [
      "business management",
      "business administration",
    ],

    "human resource": [
      "human resource",
      "human resources",
      "hr",
    ],

    "human resources": [
      "human resource",
      "human resources",
      "hr",
    ],

    "hr": [
      "human resource",
      "human resources",
      "hr",
    ],

    marketing: [
      "marketing",
      "business administration",
      "business management",
    ],

    economics: [
      "economics",
      "finance",
      "accounting",
    ],

    management: [
      "management",
      "business administration",
      "business management",
    ],

    statistics: [
      "statistics",
      "mathematics",
      "data science",
    ],

    mathematics: [
      "mathematics",
      "statistics",
      "data science",
    ],
  };

  const possibleMatches = new Set<string>();

  for (const keyword of Object.keys(
  educationAliases,
)) {
  if (user.includes(keyword)) {
    const aliases =
      educationAliases[keyword];

    if (!aliases) {
      continue;
    }

    for (const alias of aliases) {
      possibleMatches.add(alias);
    }
  }
}

  if (possibleMatches.size === 0) {
    return job.includes(user.trim());
  }

  for (const acceptedEducation of possibleMatches) {
    if (job.includes(acceptedEducation)) {
      return true;
    }
  }

  return false;
}

function getStatus(
  error: unknown,
): number | undefined {
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

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

      const rawAnswer =
        response.text?.trim();

      if (!rawAnswer) {
        throw new Error(
          `Gemini returned an empty response using ${model}`,
        );
      }

      return rawAnswer;
    } catch (error) {
      const status = getStatus(error);

      if (
        status !== 503 ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay = attempt * 3000;

      console.warn(
        `[Telegram AI] ${model} temporarily unavailable. ` +
          `Retrying in ${delay / 1000}s ` +
          `(${attempt}/${maxAttempts})...`,
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

  const userYears =
    extractYearsOfExperience(question);

  const userEducation =
    extractEducation(question);

  console.log(
    "[Telegram AI] User education:",
    userEducation || "not detected",
  );

  console.log(
    "[Telegram AI] User experience:",
    userYears ?? "not detected",
  );

  /**
   * If the user provided both education and experience,
   * perform deterministic DB matching.
   */
  if (
    userEducation &&
    userYears !== null
  ) {
    const matchingJobs = jobs.filter((job) => {
      const educationMatch =
        educationMatches(
          userEducation,
          String(
            job.educationalQualification ?? "",
          ),
        );

      const experienceMatch =
        experienceMatches(
          userYears,
          String(job.experience ?? ""),
        );

      console.log(
        `[Telegram AI] Job ${job.id} "${job.title}"`,
        {
          education:
            job.educationalQualification,
          experience: job.experience,
          educationMatch,
          experienceMatch,
        },
      );

      return (
        educationMatch &&
        experienceMatch
      );
    });

    const jobIds = matchingJobs.map((job) =>
      Number(job.id),
    );

    if (jobIds.length === 0) {
      return {
        answer:
          `I couldn't find any current jobs that match your ${userEducation} education and ${userYears} years of experience based on the job requirements.`,
        jobIds: [],
      };
    }

    /**
     * Ask Gemini only to create a natural-language
     * explanation. It does NOT decide which jobs match.
     */
    const matchedJobContext =
      matchingJobs
        .map((job) =>
          [
            `Job ID: ${job.id}`,
            `Title: ${job.title}`,
            `Educational Qualification: ${job.educationalQualification}`,
            `Experience: ${job.experience}`,
          ].join("\n"),
        )
        .join("\n\n---\n\n");

    const explanationPrompt = `
You are a professional recruitment assistant.

The backend has ALREADY determined which jobs match the user's profile.

Do NOT add or remove jobs.
Do NOT make another matching decision.
Do NOT invent requirements.

User profile:
Education: ${userEducation}
Experience: ${userYears} years

Matched jobs from the database:

${matchedJobContext}

Write a short professional Telegram response explaining that these jobs match the user's education and experience.

Mention the job titles only.

Return ONLY valid JSON:

{
  "answer": "short explanation",
  "jobIds": [${jobIds.join(", ")}]
}
`.trim();

    try {
      let rawAnswer: string;

      try {
        rawAnswer =
          await generateWithRetry(
            PRIMARY_MODEL,
            explanationPrompt,
          );
      } catch (primaryError) {
        console.warn(
          "[Telegram AI] Primary model failed. Trying fallback.",
          primaryError,
        );

        rawAnswer =
          await generateWithRetry(
            FALLBACK_MODEL,
            explanationPrompt,
          );
      }

      try {
        const parsed =
          JSON.parse(rawAnswer) as TelegramAIResult;

        return {
          answer:
            typeof parsed.answer ===
              "string" &&
            parsed.answer.trim()
              ? parsed.answer.trim()
              : `I found ${jobIds.length} matching job(s) based on your education and experience.`,
          jobIds,
        };
      } catch {
        return {
          answer:
            `I found ${jobIds.length} matching job(s) based on your education and experience.`,
          jobIds,
        };
      }
    } catch (error) {
      console.error(
        "[Telegram AI] Explanation generation failed:",
        error,
      );

      return {
        answer:
          `I found ${jobIds.length} matching job(s) based on your education and experience.`,
        jobIds,
      };
    }
  }

  /**
   * If the user didn't provide enough structured information
   * for deterministic matching, use Gemini to answer normally.
   */
  const jobContext = jobs
    .map((job) =>
      [
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
      ].join("\n"),
    )
    .join("\n\n---\n\n");

  const prompt = `
You are the AI Job Assistant for a professional recruitment Job Portal Telegram bot.

Use ONLY the current active jobs below.

Never invent jobs or job information.

If the user asks for general job information, answer using the provided database data.

If the user asks for job matching but does not provide enough information for deterministic matching, ask the user to provide:
- educational qualification
- years of experience

Return ONLY valid JSON:

{
  "answer": "string",
  "jobIds": []
}

CURRENT ACTIVE JOBS:

${jobContext || "There are currently no active jobs."}

USER QUESTION:

${question}
`.trim();

  try {
    let rawAnswer: string;

    try {
      rawAnswer =
        await generateWithRetry(
          PRIMARY_MODEL,
          prompt,
        );
    } catch (primaryError) {
      console.warn(
        "[Telegram AI] Primary model failed. Trying fallback.",
        primaryError,
      );

      rawAnswer =
        await generateWithRetry(
          FALLBACK_MODEL,
          prompt,
        );
    }

    try {
      const parsed =
        JSON.parse(rawAnswer) as TelegramAIResult;

      const validJobIds = new Set(
        jobs.map((job) => Number(job.id)),
      );

      const jobIds = Array.isArray(
        parsed.jobIds,
      )
        ? [
            ...new Set(
              parsed.jobIds
                .map(Number)
                .filter((id) =>
                  validJobIds.has(id),
                ),
            ),
          ]
        : [];

      return {
        answer:
          typeof parsed.answer ===
            "string" &&
          parsed.answer.trim()
            ? parsed.answer.trim()
            : "I could not find a suitable answer.",
        jobIds,
      };
    } catch {
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