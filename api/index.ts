import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import multer, { diskStorage } from "multer";
import path from "path";
import routes from "../src/routes/routes";
import fs from "fs";

// running dotenv for environment
dotenv.config();

// variable declaration
const app = express();
const MONGODB_URL = `mongodb+srv://dimas:${
  process.env.SECRET_KEY as string
}@animelist.oyy1g9l.mongodb.net/?retryWrites=true&w=majority`;

const fileStorage: multer.StorageEngine = diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb): void => {
    cb(null, path.resolve(`${process.cwd()}/src/video`));
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (arg0: null, arg1: boolean) => void,
): void => {
  if (file.mimetype === "video/mp4" || file.mimetype === "video/mkv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(multer({ storage: fileStorage, fileFilter }).single("trailer"));

app.use(
  "/api/video",
  express.static(path.resolve(`${process.cwd()}/src/video`)),
);
app.use("/api/anime/v1", routes);

app.use(
  (
    e: { code: number; messege: string; data: unknown },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    const code = e.code;
    const messege = e.messege;
    const data = e.data;

    res.status(code).json({
      messege,
      data,
    });
  },
);

// Connect to MongoDB
async function connectDB(): Promise<void> {
  mongoose.Promise = Promise;

  try {
    await mongoose.connect(MONGODB_URL);
    console.info("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}

void connectDB();

export default app;
