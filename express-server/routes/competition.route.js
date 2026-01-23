import express from "express";
import CompetitionController from "../controllers/competition.controller.js";

const competitionRouter = express.Router();

competitionRouter.use((req, res, next) => {
  console.log("여기는 competitions 미들웨어");
  next();
});

competitionRouter
  .route("/")
  .get(CompetitionController.getAll)
  .post((req, res) => {
    res.json({ message: "Competition 추가" });
  });

competitionRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Competition 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Competition 삭제" });
  });

export default competitionRouter;