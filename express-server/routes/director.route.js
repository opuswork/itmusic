import express from "express";
import DirectorController from "../controllers/director.controller.js";

const directorRouter = express.Router();

directorRouter.use((req, res, next) => {
  console.log("여기는 directors 미들웨어");
  next();
});

directorRouter
  .route("/")
  .get(DirectorController.getAll)
  .post(DirectorController.create);

directorRouter
  .route("/:id")
  .get(DirectorController.getOne)
  .put(DirectorController.update)
  .patch(DirectorController.update)
  .delete(DirectorController.remove);

export default directorRouter;