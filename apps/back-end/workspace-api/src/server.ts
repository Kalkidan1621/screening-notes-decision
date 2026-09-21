import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import screening from "./routes/screening.js";
import jobsRouter from "./routes/jobs.js";
import applicationsRouter from "./routes/applications.js";
import authRoutes from "./modules/auth/auth.routes.js";
import screeningRoutes from "./modules/screening/screening.routes.js";
import interviewRoutes from "./routes/interview/interview.routes.js";
import hiringDecisionRoutes from "./routes/hiring-decision/hiring-decision.routes.js";
import { employerRoutes } from "./modules/employer/employer.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import { startTelegramBot } from "./modules/telegram/telegram.bot.js";

const app = new Hono();

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:3001";

app.use(
  "*",
  cors({
    origin: "https://screening-notes-decision.vercel.app",
    credentials: true,
  }),
);

app.route("/", screening);
app.route("/jobs", jobsRouter);
app.route("/applications", applicationsRouter);
app.route("/auth", authRoutes);
app.route("/hiring/screening", screeningRoutes);
app.route("/hiring/interviews", interviewRoutes);
app.route("/hiring/decision", hiringDecisionRoutes);
app.route("/api/employers", employerRoutes);
app.route("/admin/users", userRoutes);

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on port ${port}`);

startTelegramBot().catch((error) => {
  console.error("Failed to start Telegram bot:", error);
});