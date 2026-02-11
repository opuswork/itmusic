import express from "express";
import CultureController from "../controllers/culture.controller.js";

const cultureRouter = express.Router();

cultureRouter.use((req, res, next) => {
  console.log("여기는 cultures 미들웨어");
  next();
});

cultureRouter
  .route("/")
  .get(CultureController.getAll)
  .post(CultureController.create);

cultureRouter
  .route("/:id")
  .get(CultureController.getOne)
  .put(CultureController.update)
  .patch(CultureController.update)
  .delete(CultureController.remove);

export default cultureRouter;