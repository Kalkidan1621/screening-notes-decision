import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN is not configured",
  );
}

export const telegramBot = new Bot(token);

export const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:3001";