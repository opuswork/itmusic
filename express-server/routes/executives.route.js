import express from "express";
import ExecutivesController from "../controllers/executives.controller.js";

const executivesRouter = express.Router();

executivesRouter.use((req, res, next) => {
  console.log("여기는 executives 미들웨어");
  next();
});

executivesRouter
  .route("/")
  .get(ExecutivesController.getAll)
  .post(ExecutivesController.create);

executivesRouter
  .route("/:id")
  .get(ExecutivesController.getOne)
  .put(ExecutivesController.update)
  .patch(ExecutivesController.update)
  .delete(ExecutivesController.remove);

export default executivesRouter;