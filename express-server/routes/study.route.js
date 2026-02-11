import express from "express";
import StudyController from "../controllers/study.controller.js";

const studyRouter = express.Router();

studyRouter.use((req, res, next) => {
  console.log("여기는 studies 미들웨어");
  next();
});

studyRouter
  .route("/")
  .get(StudyController.getAll)
  .post(StudyController.create);

studyRouter
  .route("/:id")
  .get(StudyController.getOne)
  .put(StudyController.update)
  .patch(StudyController.update)
  .delete(StudyController.remove);

export default studyRouter;