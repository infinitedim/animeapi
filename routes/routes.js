import express from "express";
import { get, post, search, edit, del } from "../controllers/controllers";
import { body } from "express-validator";

const routes = express.Router();

routes.get("/get", get);

routes.post(
  "/post",
  [
    body("title")
      .isLength({ min: 5, max: 50 })
      .withMessage("title at least 5 character"),
    body("sinopsys")
      .isLength({ min: 10, max: 1000 })
      .withMessage("sinopsys at least 100 character"),
    body("author").isLength({ min: 5 }).withMessage("Author is required"),
    body("year").isLength({ min: 2, max: 4 }).withMessage("Year is required"),
  ],
  post
);

routes.get("/get/:id", search);

routes.put(
  "/edit/:id",
  [
    body("title")
      .isLength({ min: 5, max: 50 })
      .withMessage("Title at least 5 character"),
    body("sinopsys")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Sinopsys at least 100 character"),
    body("author")
      .isLength({ min: 5, max: 20 })
      .withMessage("Author is required"),
    body("year").isLength({ min: 2, max: 4 }).withMessage("Year is required"),
  ],
  edit
);

routes.delete("/delete/:id", del);

export default routes;
