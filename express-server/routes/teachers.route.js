import express from "express";
import TeachersController from "../controllers/teachers.controller.js";

const teachersRouter = express.Router();

teachersRouter.use((req, res, next) => {
  console.log("여기는 teachers 미들웨어");
  next();
});

teachersRouter
  .route("/")
  .get(TeachersController.getAll)
  .post((req, res) => {
    res.json({ message: "Teachers 추가" });
  });

teachersRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Teachers 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Teachers 삭제" });
  });

export default teachersRouter;