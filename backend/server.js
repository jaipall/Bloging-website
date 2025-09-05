import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
// trust proxy for secure cookies behind Render/Proxies
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const allowedOriginsEnv = process.env.CORS_ORIGIN || "http://localhost:5173";
const allowedOrigins = allowedOriginsEnv.split(",").map((o) => o.trim());
const matchOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  for (const pattern of allowedOrigins) {
    if (pattern.includes("*")) {
      const regex = new RegExp(
        "^" +
          pattern
            .replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&")
            .replace(/\\\*/g, ".*") +
          "$"
      );
      if (regex.test(origin)) return true;
    }
  }
  return false;
};
const corsOptions = {
  origin: function (origin, callback) {
    if (matchOrigin(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const _dirname = path.resolve();

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

// health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// Serve frontend only if dist exists (useful for backend-only deploy)
import { existsSync } from "fs";
const distPath = path.join(_dirname, "frontend", "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
  connectDB();
});
