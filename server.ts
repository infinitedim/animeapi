/* eslint-disable @typescript-eslint/restrict-template-expressions */
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import path, { join } from "path";
import { fileURLToPath } from "url";
import multer, { diskStorage } from "multer";
import dotenv from "dotenv";
import helmet from "helmet";
import routes from "./routes/routes";
import { Server, IncomingMessage, ServerResponse } from "http";

// running dotenv for environtment
dotenv.config();

// variable declaration
const app = express();
const port: string | 88 = process.env.PORT ?? 88;
const FILENAME: string = fileURLToPath(import.meta.url);
const DIRNAME: string = path.dirname(FILENAME);
const mongoUrl = `mongodb+srv://dimas:${process.env.SECRET_KEY}@animelist.oyy1g9l.mongodb.net/?retryWrites=true&w=majority`;

const fileStorage: multer.StorageEngine = diskStorage({
  destination: (
    req,
    _file: Express.Multer.File,
    cb: (arg0: null, arg1: string) => void,
  ): void => {
    cb(null, "video");
  },
  filename: (
    req: Request,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void,
  ): void => {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void,
): void => {
  if (file.mimetype === "video/mp4" || file.mimetype === "video/mkv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.use("/video", express.static(join(DIRNAME, "video")));
app.use("/anime/v1", routes);
app.use(multer({ storage: fileStorage, fileFilter }).single("trailer"));

app.use(
  (
    e: { code: number; messege: string; data: unknown },
    req: Request,
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

connect(mongoUrl)
  .then(
    (): Server<typeof IncomingMessage, typeof ServerResponse> =>
      app.listen(port, (): void => {
        console.log(`Server is listening on port ${port}`);
      }),
  )
  .catch((e): void => console.error(e));
