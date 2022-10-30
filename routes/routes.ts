import { Router } from "express";
import { get, post, search, edit, del } from "../controllers/controllers";
import { body, ValidationChain } from "express-validator";

const routes = Router();

const validation: ValidationChain[] = [
  body("title")
    .isLength({ min: 5, max: 50 })
    .withMessage("title at least 5 character"),
  body("sinopsys")
    .isLength({ min: 10, max: 1000 })
    .withMessage("sinopsys at least 100 character"),
  body("author").isLength({ min: 5 }).withMessage("Author is required"),
  body("year").isLength({ min: 2, max: 4 }).withMessage("Year is required"),
];

routes.get("/get", get);
routes.post("/post", validation, post);
routes.get("/search/:id", search);
routes.put("/edit/:id", validation, edit);
routes.delete("/delete/:id", del);

export default routes;
