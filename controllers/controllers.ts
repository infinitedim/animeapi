import path from "path";
import { ValidationError, validationResult, Result } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { PathLike, unlink } from "fs";
import AnimeModel from "../models/models";

interface resultsInterface {
  trailer?: any;
  title?: any;
  sinopsys?: any;
  author?: any;
  year?: any;
}

const get = async (req: Request, res: Response): Promise<void> => {
  const data = await AnimeModel.find();
  res.status(200).json({
    status: "OK",
    messege: "Successfully get data",
    code: 200,
    data,
  });
};

const post = (req: Request, res: Response): void => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    const e = new Error("Invalid value");
    e.code = 400;
    e.data = error.array();
    throw e;
  }

  if (req.file != null) {
    const e = new Error("Files must be upload");
    e.code = 422;
    throw e;
  }

  const results: resultsInterface = {
    trailer: req.file.path,
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  const posting = new AnimeModel(results);

  posting
    .save()
    .then((response): void => {
      res.status(201).json({
        messege: "Successfully post new data",
        code: 201,
        data: response,
      });
    })
    .catch((e) => console.error(e));
};

const search = async (req: Request, res: Response): Promise<void> => {
  const animeId: string = req.params.id;
  const data = await AnimeModel.findById(animeId);

  res.status(200).json({
    code: 200,
    status: "OK",
    messege: "Successfully get data by id",
    data,
  });
};

const edit = (req: Request, res: Response, next: NextFunction): void => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    const e = new Error("Invalid value");
    e.code = 400;
    e.data = error.array();
    throw e;
  }

  if (req.file != null) {
    const e = new Error("Files must be upload");
    e.code = 422;
    throw e;
  }

  const results: resultsInterface = {
    trailer: req.file.path,
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  const animeId: string = req.params.id;
  AnimeModel.findById(animeId)
    .then((response): void => {
      if (response == null) {
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
    .then((response): void => {
      res.status(200).json({
        status: "OK",
        code: 200,
        messege: "Successfully update data",
        data: response,
      });
    })
    .catch((e) => next(e));
};

const del = (req: Request, res: Response, next: NextFunction): void => {
  const animeId: string = req.params.id;
  AnimeModel.findById(animeId)
    .then((response): void => {
      if (response == null) {
        const err = new Error("Anime not found!");
        err.code(404);
      }

      deletetrailer(response.trailer);
      return AnimeModel.findByIdAndRemove(animeId);
    })
    .then((response): void => {
      res.status(200).json({
        status: "OK",
        code: 200,
        messege: "Data deleted",
        data: response,
      });
    })
    .catch((e) => next(e));
};

const deletetrailer = (filePath: PathLike): void => {
  filePath = path.join(`${__dirname}../${filePath}`);
  unlink(filePath, (e) => console.error(e));
};

export { get, post, search, edit, del };
