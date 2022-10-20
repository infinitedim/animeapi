import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import { connect } from "mongoose";
import path, { join } from "path";
import { fileURLToPath } from "url";
import multer, { diskStorage } from "multer";
import dotenv from "dotenv";

// running dotenv for environtment
dotenv.config();

// variable declaration
const app = express();
const port = process.env.PORT || 88;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "video");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4" || file.mimetype === "video/mkv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());

app.use(bodyParser.json());

app.use("/video", express.static(join(__dirname, "video")));

app.use("/anime/v1", routes);

app.use(multer({ storage: fileStorage, fileFilter }).single("trailer"));

app.use((e, req, res, next) => {
  const code = e.code || 500;
  const messege = e.messege;
  const data = e.data;

  res.status(code).json({
    messege,
    data,
  });
});

connect(
  `mongodb+srv://dimas:FriHpGaHsr6JUC6s@animelist.oyy1g9l.mongodb.net/?retryWrites=true&w=majority`
)
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    })
  )
  .catch((e) => console.error(e));
