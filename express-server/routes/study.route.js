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
  .post((req, res) => {
    res.json({ message: "Study 추가" });
  });

studyRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Study 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Study 삭제" });
  });

export default studyRouter;