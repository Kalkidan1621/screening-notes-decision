import "dotenv/config";//f w y e v e
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";//node js
import { Hono } from "hono";
import screening from "./routes/screening.js";//get and post api route use file
import jobsRouter from "./routes/jobs.js";
import applicationsRouter from "./routes/applications.js";
import authRoutes from "./modules/auth/auth.routes.js";
import screeningRoutes from "./modules/screening/screening.routes.js";
import interviewRoutes from "./routes/interview/interview.routes.js";
import hiringDecisionRoutes from "./routes/hiring-decision/hiring-decision.routes.js";
import { employerRoutes } from "./modules/employer/employer.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.route("/", screening);
app.route("/jobs", jobsRouter);
app.route("/applications", applicationsRouter);
app.route("/auth", authRoutes);
app.route("/hiring/screening",screeningRoutes);
app.route("/hiring/interviews",interviewRoutes);
app.route(
  "/hiring/decision",
  hiringDecisionRoutes,
);
app.route("/api/employers", employerRoutes);
app.route("/admin/users", userRoutes);
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on http://localhost:3000");