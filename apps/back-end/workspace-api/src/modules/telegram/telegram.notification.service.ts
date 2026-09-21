import type { jobs } from "../../db/schema.js";

import {
  getSubscribedTelegramUsers,
} from "./telegram.subscriber.service.js";

import {
  frontendUrl,
  telegramBot,
} from "./telegram.client.js";

type Job = typeof jobs.$inferSelect;

export async function notifyNewJob(
  job: Job,
) {
  console.log(
    `[Telegram] notifyNewJob called for job ${job.id}: ${job.title}`,
  );

  if (job.status !== "active") {
    console.log(
      `[Telegram] Job ${job.id} is not active. Notification skipped.`,
    );
    return;
  }

  const subscribers =
    await getSubscribedTelegramUsers();

  console.log(
    `[Telegram] Active subscribers: ${subscribers.length}`,
  );

  if (subscribers.length === 0) {
    console.log(
      "[Telegram] No subscribed users found.",
    );
    return;
  }

  const jobUrl =
    `${frontendUrl}/jobs/${job.id}`;

  for (const subscriber of subscribers) {
    try {
      console.log(
        `[Telegram] Sending job ${job.id} to ${subscriber.chatId}`,
      );

      await telegramBot.api.sendMessage(
        subscriber.chatId,
        [
          "New Job Available!",
          "",
          `${job.title}`,
          `Employer: ${job.employer}`,
          `Location: ${job.location}`,
          ` Type: ${job.employmentType}`,
          ` Working Time: ${job.workingTime}`,
          `Experience: ${job.experience}`,
          ` Education: ${job.educationalQualification}`,
          ` Salary: ${job.salary}`,
          "",
          ` Closing Date: ${job.closingDate}`,
          "",
          "A new opportunity has been published on Job Portal.",
        ].join("\n"),
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📄 View Job",
                  url: jobUrl,
                },
              ],
            ],
          },
        },
      );

      console.log(
        `[Telegram] Successfully sent job ${job.id} to ${subscriber.chatId}`,
      );
    } catch (error) {
      console.error(
        `[Telegram] Failed to notify subscriber ${subscriber.chatId}:`,
        error,
      );
    }
  }
}