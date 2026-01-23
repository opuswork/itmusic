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
  .post((req, res) => {
    res.json({ message: "Culture 추가" });
  });

cultureRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Culture 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Culture 삭제" });
  });

export default cultureRouter;