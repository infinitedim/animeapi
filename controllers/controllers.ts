import { Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { unlink } from "fs";
import path from "path";
import AnimeModel from "../models/models";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode !== undefined ? statusCode : 500;
  }
}

function sendCustomError(res: Response, error: CustomError): Response {
  console.error(error);

  return res.status(error?.statusCode ?? 500).json({
    code: error?.statusCode ?? 500,
    message: error?.message ?? "Internal Server error",
    status: "ERROR",
  });
}

function deletetrailer(filePath: string): void {
  filePath = path.join(`${__dirname}../${filePath}`);

  unlink(filePath, (e) => console.error(e));
}

interface resultsInterface {
  trailer?: string;
  title?: string;
  sinopsys?: string;
  author?: string;
  year?: string;
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

const post = async (
  req: Request<undefined, unknown, resultsInterface>,
  res: Response,
): Promise<Response> => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    throw new Error("Invalid value");
  }

  if (req.file == null || req.file === undefined) {
    throw new Error("Files must be upload");
  }

  const results: resultsInterface = {
    trailer: "path" in req.file ? req.file?.path : "",
    title: req.body.title,
    sinopsys: req.body.sinopsys,
    author: req.body.author,
    year: req.body.year,
  };

  try {
    const posting = new AnimeModel(results);
    const savedAnime = await posting.save();

    if (savedAnime === null || savedAnime === undefined) {
      throw new CustomError("Error when posting anime");
    }

    return res.status(201).json({
      code: 201,
      message: "Successfully post new data",
      status: "OK",
      data: savedAnime,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return sendCustomError(res, error);
    }

    throw error;
  }
};

const search = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  try {
    const data = await AnimeModel.findById(id);

    return res.status(200).json({
      code: 200,
      status: "OK",
      messege: "Successfully get data by id",
      data,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return sendCustomError(res, error);
    }

    throw error;
  }
};

const edit = async (
  req: Request<{ id: string }, unknown, resultsInterface>,
  res: Response,
): Promise<Response> => {
  const error: Result<ValidationError> = validationResult(req);

  if (!error.isEmpty()) {
    throw new Error("Invalid value");
  }

  if (req.file == null || req.file === undefined) {
    throw new Error("Files must be upload");
  }

  const results: resultsInterface = {
    trailer: "path" in req.file ? req.file?.path : "", // ini possible undefined req.file nya
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
      throw new CustomError("Anime not found", 404);
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
      });
    }

    return res.status(200).json({
      status: "OK",
      code: 200,
      message: "Data updated successfully",
      data: updatedAnime,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return sendCustomError(res, error);
    }

    throw error;
  }
};

const del = async (
  req: Request<{
    id: string;
  }>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  try {
    const anime = await AnimeModel.findById(id);

    if (anime == null) {
      throw new CustomError("Anime not found", 404);
    }

    const deletedAnime = await AnimeModel.findOneAndDelete({
      _id: id,
    });

    if (deletedAnime == null) {
      throw new CustomError("Error when deleting anime", 500);
    }

    deletetrailer(deletedAnime.trailer);

    return res.status(200).json({
      status: "OK",
      code: 200,
      message: "Data deleted",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return sendCustomError(res, error);
    }

    throw error;
  }
};

export { get, post, search, edit, del };
