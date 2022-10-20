import { validationResult } from "express-validator";
import AnimeModel from "../models/models";
import path from "path";
import { fileURLToPath } from "url";
import { unlink } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const get = (req, res) => {
  AnimeModel.find().then((response) => {
    res.status(200).json({
      status: "OK",
      messege: "Successfully get data",
      code: 200,
      data: response,
    });
  });
};

const post = (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const e = new Error("Invalid value");
    e.code = 400;
    e.data = error.array();
    throw e;
  }

  if (!req.file) {
    const e = new Error("Files must be upload");
    e.code = 422;
    throw e;
  }

  let results = {
    trailer: req.file.path,
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  const posting = new AnimeModel(results);

  posting
    .save()
    .then((response) => {
      res.status(201).json({
        messege: "Successfully post new data",
        code: 201,
        data: response,
      });
    })
    .catch((e) => console.error(e));
};

const search = (req, res) => {
  const animeId = req.params.id;
  AnimeModel.findById(animeId).then((response) =>
    res.status(200).json({
      code: 200,
      status: "OK",
      messege: "Successfully get data by id",
      data: response,
    })
  );
};

const edit = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const e = new Error("Invalid value");
    e.code = 400;
    e.data = error.array();
    throw e;
  }

  if (!req.file) {
    const e = new Error("Files must be upload");
    e.code = 422;
    throw e;
  }

  let results = {
    trailer: req.file.path,
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  const animeId = req.params.id;
  AnimeModel.findById(animeId)
    .then((response) => {
      if (!response) {
        const err = new Error("Anime not found!");
        err.code(404);
      }

      response.trailer = results.trailer;
      response.title = results.title;
      response.sinopsys = results.sinopsys;
      response.author = results.author;
      response.year = results.year;

      response.save();
    })
    .then((response) => {
      res.status(200).json({
        status: "OK",
        code: 200,
        messege: "Successfully update data",
        data: response,
      });
    })
    .catch((e) => next(e));
};

const del = (req, res, next) => {
  const animeId = req.params.id;
  AnimeModel.findById(animeId)
    .then((response) => {
      if (!response) {
        const err = new Error("Anime not found!");
        err.code(404);
      }

      deletetrailer(response.trailer);
      return AnimeModel.findByIdAndRemove(animeId);
    })
    .then((response) => {
      res.status(200).json({
        status: "OK",
        code: 200,
        messege: "Data deleted",
        data: response,
      });
    })
    .catch((e) => next(e));
};

const deletetrailer = (filePath) => {
  filePath = path.join(__dirname + "../" + filePath);
  unlink(filePath, (e) => console.error(e));
};

export { get, post, search, edit, del };
