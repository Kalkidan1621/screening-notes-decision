import { InlineKeyboard } from "grammy";

import {
  telegramBot,
  frontendUrl,
} from "./telegram.client.js";

import { getActiveJobs } from "../../services/jobs.js";

import {
  subscribeTelegramUser,
  unsubscribeTelegramUser,
} from "./telegram.subscriber.service.js";

import { askTelegramAI } from "./telegram.ai.service.js";


/**
 * Send matching jobs with professional job cards.
 */
async function sendMatchingJobs(
  ctx: any,
  jobIds: number[],
) {
  if (jobIds.length === 0) {
    return false;
  }

  const jobs = await getActiveJobs();

  const matchingJobs = jobs.filter((job) =>
    jobIds.includes(Number(job.id)),
  );

  if (matchingJobs.length === 0) {
    return false;
  }

  for (const job of matchingJobs) {
    const jobUrl = `${frontendUrl}/jobs/${job.id}`;

    const keyboard = new InlineKeyboard().url(
      "📄 View Job",
      jobUrl,
    );

    const jobMessage = [
      `💼 ${job.title}`,
      "",
      `🏢 Employer: ${job.employer}`,
      `📍 Location: ${job.location}`,
      `💰 Salary: ${job.salary}`,
      `💼 Experience: ${job.experience}`,
      `🎓 Education: ${job.educationalQualification}`,
      "",
      `📅 Closing Date: ${job.closingDate}`,
    ].join("\n");

    await ctx.reply(jobMessage, {
      reply_markup: keyboard,
    });
  }

  return true;
}


/**
 * /start
 */
telegramBot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text(
      "🔔 Subscribe to Job Alerts",
      "subscribe_jobs",
    )
    .text(
      "🔕 Unsubscribe",
      "unsubscribe_jobs",
    )
    .row()
    .text(
      "💼 View Jobs",
      "view_jobs",
    );

  await ctx.reply(
    [
      "👋 Welcome to Job Portal!",
      "",
      "Find available jobs and get notified",
      "when new opportunities are published.",
      "",
      "Choose an option below:",
    ].join("\n"),
    {
      reply_markup: keyboard,
    },
  );
});


/**
 * Subscribe
 */
telegramBot.callbackQuery(
  "subscribe_jobs",
  async (ctx) => {
    try {
      const chatId = ctx.from.id;
      const username = ctx.from.username;

      await subscribeTelegramUser(
        chatId,
        username,
      );

      await ctx.answerCallbackQuery({
        text: "Job alerts enabled!",
      });

      await ctx.reply(
        [
          "🔔 Job alerts enabled!",
          "",
          "You will receive a Telegram notification",
          "when a new job is published.",
        ].join("\n"),
      );
    } catch (error) {
      console.error(
        "Failed to subscribe Telegram user:",
        error,
      );

      await ctx.answerCallbackQuery({
        text: "Something went wrong.",
        show_alert: true,
      });
    }
  },
);


/**
 * Unsubscribe
 */
telegramBot.callbackQuery(
  "unsubscribe_jobs",
  async (ctx) => {
    try {
      const chatId = ctx.from.id;

      await unsubscribeTelegramUser(chatId);

      await ctx.answerCallbackQuery({
        text: "Job alerts disabled.",
      });

      await ctx.reply(
        [
          "🔕 Job alerts disabled.",
          "",
          "You can subscribe again anytime with /start.",
        ].join("\n"),
      );
    } catch (error) {
      console.error(
        "Failed to unsubscribe Telegram user:",
        error,
      );

      await ctx.answerCallbackQuery({
        text: "Something went wrong.",
        show_alert: true,
      });
    }
  },
);


/**
 * View jobs
 */
telegramBot.callbackQuery(
  "view_jobs",
  async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.reply(
      "💼 Use /jobs to view all currently available jobs.",
    );
  },
);


/**
 * /ai command
 */
telegramBot.command("ai", async (ctx) => {
  const question = ctx.match.trim();

  if (!question) {
    await ctx.reply(
      [
        "🤖 AI Job Assistant",
        "",
        "Ask me anything about available jobs.",
        "",
        "Examples:",
        "",
        "/ai What jobs are available in Addis Ababa?",
        "",
        "/ai What are the requirements for Accountant?",
        "",
        "/ai I have a bachelor's degree in accounting and 2 years experience. Which jobs match me?",
      ].join("\n"),
    );

    return;
  }

  try {
    await ctx.reply("🤖 Thinking...");

    const result = await askTelegramAI(question);

    await ctx.reply(
      [
        "🤖 AI Job Assistant",
        "",
        result.answer,
      ].join("\n"),
    );

    await sendMatchingJobs(
      ctx,
      result.jobIds,
    );
  } catch (error) {
    console.error(
      "[Telegram AI] Failed to answer question:",
      error,
    );

    await ctx.reply(
      [
        "⚠️ AI Assistant Temporarily Unavailable",
        "",
        "I couldn't process your request right now.",
        "Please try again shortly.",
      ].join("\n"),
    );
  }
});


/**
 * /help
 */
telegramBot.command("help", async (ctx) => {
  await ctx.reply(
    [
      "🤖 Job Portal Assistant",
      "",
      "/start - Start the bot",
      "/jobs - View available jobs",
      "/ai - Ask the AI assistant about jobs",
      "/help - Show help",
    ].join("\n"),
  );
});


/**
 * /jobs
 */
telegramBot.command("jobs", async (ctx) => {
  try {
    const jobs = await getActiveJobs();

    if (jobs.length === 0) {
      await ctx.reply(
        "📭 There are currently no active jobs available.",
      );

      return;
    }

    await ctx.reply(
      [
        "💼 Available Jobs",
        "",
        `Currently available: ${jobs.length}`,
      ].join("\n"),
    );

    for (const job of jobs) {
      const jobUrl = `${frontendUrl}/jobs/${job.id}`;

      const keyboard = new InlineKeyboard().url(
        "📄 View Job",
        jobUrl,
      );

      await ctx.reply(
        [
          `💼 ${job.title}`,
          "",
          `🏢 Employer: ${job.employer}`,
          `📍 Location: ${job.location}`,
          `💼 Employment: ${job.employmentType}`,
          `⏰ Working Time: ${job.workingTime}`,
          `📊 Experience: ${job.experience}`,
          `🎓 Education: ${job.educationalQualification}`,
          `💰 Salary: ${job.salary}`,
          "",
          `📅 Closing Date: ${job.closingDate}`,
        ].join("\n"),
        {
          reply_markup: keyboard,
        },
      );
    }
  } catch (error) {
    console.error(
      "Failed to fetch Telegram jobs:",
      error,
    );

    await ctx.reply(
      "❌ Sorry, I couldn't load the jobs right now. Please try again later.",
    );
  }
});


/**
 * Direct text messages
 *
 * Example:
 * "I have accounting degree and 2 years experience"
 */
telegramBot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  if (!text || text.startsWith("/")) {
    return;
  }

  try {
    await ctx.reply("🤖 Thinking...");

    const result = await askTelegramAI(text);

    await ctx.reply(
      [
        "🤖 AI Job Assistant",
        "",
        result.answer,
      ].join("\n"),
    );

    await sendMatchingJobs(
      ctx,
      result.jobIds,
    );
  } catch (error) {
    console.error(
      "[Telegram AI] Failed to answer message:",
      error,
    );

    await ctx.reply(
      [
        "⚠️ AI Assistant Temporarily Unavailable",
        "",
        "I couldn't process your request right now.",
        "Please try again shortly.",
      ].join("\n"),
    );
  }
});


/**
 * Start Telegram bot
 */
export async function startTelegramBot() {
  await telegramBot.start({
    onStart: (botInfo) => {
      console.log(
        `Telegram bot started: @${botInfo.username}`,
      );
    },
  });
}