import "dotenv/config";//f w y e v e
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";//node js
import { Hono } from "hono";
import screening from "./routes/screening.js";//get and post api route use file
import jobsRouter from "./routes/jobs.js";
import applicationsRouter from "./routes/applications.js";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
  })
);

app.route("/", screening);
app.route("/jobs", jobsRouter);
app.route("/applications", applicationsRouter);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on http://localhost:3000");