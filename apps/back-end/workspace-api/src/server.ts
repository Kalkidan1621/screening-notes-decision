import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import screening from "./routes/screening";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
  })
);

app.route("/", screening);

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on http://localhost:3000");