import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import logger from "./middlewares/logger.js";
import authRouter from "./routes/auth.route.js";
import competitionRouter from "./routes/competition.route.js";
import concertRouter from "./routes/concert.route.js";
import consultantsRouter from "./routes/consultants.route.js";
import cultureRouter from "./routes/culture.route.js";
import directorRouter from "./routes/director.route.js";
import executivesRouter from "./routes/executives.route.js";
import noticeRouter from "./routes/notice.route.js";
import operatorsRouter from "./routes/operators.route.js";
import studyRouter from "./routes/study.route.js";
import teachersRouter from "./routes/teachers.route.js";
import videoRouter from "./routes/video.route.js";
import sliderRouter from "./routes/slider.route.js";

const app = express();
const upload = multer({ dest: "uploads/" });

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middlewares
app.use(cookieParser()); // 3rd party middleware
app.use(express.json()); // built-in middleware
app.use(logger); // custom middleware
app.use(express.static("uploads"));
// public 폴더의 assets 정적 파일 제공 (절대 경로 사용)
const publicAssetsPath = path.join(__dirname, "..", "public", "assets");
app.use("/assets", express.static(publicAssetsPath));

// routes
app.use("/auth", authRouter);
app.use("/api/auth", authRouter); // 카카오 로그인을 위한 /api/auth 경로도 지원
app.use("/competitions", competitionRouter);
app.use("/concerts", concertRouter);
app.use("/consultants", consultantsRouter);
app.use("/cultures", cultureRouter);
app.use("/directors", directorRouter);
app.use("/executives", executivesRouter);
app.use("/notices", noticeRouter);
app.use("/operators", operatorsRouter);
app.use("/studies", studyRouter);
app.use("/teachers", teachersRouter);
app.use("/videos", videoRouter);
app.use("/sliders", sliderRouter);

// file upload example
app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  res.json({ message: "File uploaded" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});