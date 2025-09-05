// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./database/db.js";
// import userRoute from "./routes/user.route.js";
// import blogRoute from "./routes/blog.route.js";
// import commentRoute from "./routes/comment.route.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// dotenv.config();
// const app = express();

// const PORT = process.env.PORT || 3000;

// // default middleware
// // trust proxy for secure cookies behind Render/Proxies
// app.set("trust proxy", 1);
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Simplified explicit CORS for your Vercel frontend
// app.use(
//   cors({
//     origin: "https://bloging-website-plum.vercel.app",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     credentials: true,
//   })
// );
// app.options("*", cors());

// const _dirname = path.resolve();

// // apis
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/blog", blogRoute);
// app.use("/api/v1/comment", commentRoute);

// // health check
// app.get("/health", (_, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Serve frontend only if dist exists (useful for backend-only deploy)
// import { existsSync } from "fs";
// const distPath = path.join(_dirname, "frontend", "dist");
// if (existsSync(distPath)) {
//   app.use(express.static(distPath));
//   app.get("*", (_, res) => {
//     res.sendFile(path.join(distPath, "index.html"));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`Server listen at port ${PORT}`);
//   connectDB();
// });

import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware
app.set("trust proxy", 1); // trust Render/Proxies for secure cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//  CORS Setup (fix for Vercel + localhost)
const allowedOrigins = [
  "https://bloging-website-plum.vercel.app", // frontend (Vercel)
  "http://localhost:5173", // local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

//  Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

//  Health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

//  Serve frontend if dist exists (for all-in-one deploys on Render)
const __dirname = path.resolve();
const distPath = path.join(__dirname, "frontend", "dist");

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

//  Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  connectDB();
});
