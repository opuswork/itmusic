import express from "express";
import ConcertController from "../controllers/concert.controller.js";

const concertRouter = express.Router();

concertRouter.use((req, res, next) => {
  console.log("여기는 concerts 미들웨어");
  next();
});

concertRouter
  .route("/")
  .get(ConcertController.getAll)
  .post((req, res) => {
    res.json({ message: "Concert 추가" });
  });

concertRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Concert 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Concert 삭제" });
  });

export default concertRouter;