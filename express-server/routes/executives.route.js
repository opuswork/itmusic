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
  .post((req, res) => {
    res.json({ message: "Executives 추가" });
  });

executivesRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Executives 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Executives 삭제" });
  });

export default executivesRouter;