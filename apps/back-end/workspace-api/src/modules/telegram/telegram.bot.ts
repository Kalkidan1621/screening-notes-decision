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


telegramBot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("🔔 Subscribe to Job Alerts", "subscribe_jobs")
    .text("🔕 Unsubscribe", "unsubscribe_jobs")
    .row()
    .text("💼 View Jobs", "view_jobs");

  await ctx.reply(
    "👋 Welcome to Job Portal!\n\n" +
      "Get notified on Telegram when new jobs are published.\n\n" +
      "Choose an option below:",
    {
      reply_markup: keyboard,
    },
  );
});

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
        "🔔 Job alerts are now enabled.\n\n" +
          "You will receive a Telegram notification when a new job is published.",
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
        "🔕 Job alerts are now disabled.\n\n" +
          "You can subscribe again anytime with /start.",
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

telegramBot.callbackQuery(
  "view_jobs",
  async (ctx) => {
    await ctx.answerCallbackQuery();

    await ctx.reply(
      "💼 Use /jobs to view all currently available jobs.",
    );
  },
);
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
        "/ai What jobs are available in Addis Ababa?",
        "/ai What are the requirements for Accountant?",
        "/ai I have a bachelor's degree in accounting and 2 years experience. Which jobs match me?",
      ].join("\n"),
    );

    return;
  }

  try {
    await ctx.reply("🤖 Thinking...");

    const result = await askTelegramAI(question);

    await ctx.reply(result.answer);

    if (result.jobIds.length > 0) {
      for (const jobId of result.jobIds) {
        const jobUrl = `${frontendUrl}/jobs/${jobId}`;

        const keyboard = new InlineKeyboard().url(
          "📄 View Job",
          jobUrl,
        );

        await ctx.reply(
          "📄 View this job for more details and to apply:",
          {
            reply_markup: keyboard,
          },
        );
      }
    }
  } catch (error) {
    console.error(
      "[Telegram AI] Failed to answer question:",
      error,
    );

    await ctx.reply(
      "Sorry, I could not answer your question right now. Please try again later.",
    );
  }
});
telegramBot.command("help", async (ctx) => {
  await ctx.reply(
    "🤖 Job Portal Assistant\n\n" +
      "/start - Start the bot\n" +
      "/jobs - View available jobs\n" +
      "/ai - Ask the AI assistant about jobs\n" +
      "/help - Show help",
  );
});

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
      `💼 Available Jobs (${jobs.length})`,
    );

    for (const job of jobs) {
      const jobUrl =
        `${frontendUrl}/jobs/${job.id}`;

      const keyboard = new InlineKeyboard()
        .url("📄 View Job", jobUrl);

      await ctx.reply(
        [
          `💼 ${job.title}`,
          "",
          `Employer: ${job.employer}`,
          `Location: ${job.location}`,
          `Type: ${job.employmentType}`,
          `Working Time: ${job.workingTime}`,
          `Experience: ${job.experience}`,
          `Education: ${job.educationalQualification}`,
          `Salary: ${job.salary}`,
          "",
          `Closing Date: ${job.closingDate}`,
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

telegramBot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  if (!text || text.startsWith("/")) {
    return;
  }

  try {
    await ctx.reply("🤖 Thinking...");

    const result = await askTelegramAI(text);

    await ctx.reply(result.answer);

    if (result.jobIds.length > 0) {
      for (const jobId of result.jobIds) {
        const jobUrl = `${frontendUrl}/jobs/${jobId}`;

        const keyboard = new InlineKeyboard().url(
          "📄 View Job",
          jobUrl,
        );

        await ctx.reply(
          "📄 View this job for more details and to apply:",
          {
            reply_markup: keyboard,
          },
        );
      }
    }
  } catch (error) {
    console.error(
      "[Telegram AI] Failed to answer message:",
      error,
    );

    await ctx.reply(
      "Sorry, I could not answer your question right now. Please try again later.",
    );
  }
});

export async function startTelegramBot() {
  await telegramBot.start({
    onStart: (botInfo) => {
      console.log(
        `Telegram bot started: @${botInfo.username}`,
      );
    },
  });
}