/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from "path";
import { ValidationError, validationResult, Result } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { PathLike, unlink } from "fs";
import AnimeModel from "../models/models";

interface resultsInterface {
  trailer?: string;
  title?: string;
  sinopsys?: string;
  author?: string;
  year?: string;
}

interface ErrorInterface {
  code: number;
  data: unknown;
}

interface EditAnimeRequestType extends Request {
  file?: ReturnType<typeof File>;
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

const post = (
  req: Request, res: Response,
): void => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    const e: ErrorInterface = new Error("Invalid value");
    e.code = 400;
    e.data = error.array();
    throw e;
  }

  if (req.file != null) {
    const e: ReturnType<typeof Error> & ErrorInterface = new Error(
      "Files must be upload",
    );
    e.code = 422;
    throw e;
  }

  const results: resultsInterface = {
    trailer: req.file?.path ?? "", 
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

const edit = async (req: EditAnimeRequestType, res: Response): Promise<Response> => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    throw new Error("Invalid value");
  }

  if (req.file != null) {
    throw new Error("Files must be upload");
  }

  const results: resultsInterface = {
    trailer: req.file?.path ?? "", // ini possible undefined req.file nya
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  try {
    const { id } = req.params;
    const check = await AnimeModel.findOne({
      _id: id,
    });

    if (check == null) {
      return res.status(404).json({
        // ...code
      });
    }

    const updatedAnime = await AnimeModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          trailer: results.trailer,
          title: results.title,
          sinopsys: results.sinopsys,
          author: results.author,
          year: results.year,
        },
      },
    );

    if (updatedAnime == null) {
      return res.status(500).json({
        status: "ERROR",
        code: 500,
        messege: "...",
        data: response,
      });
    }

    return res.status(200).json({
      // ...code
    });
  } catch (error) {
    throw error;
  }
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
