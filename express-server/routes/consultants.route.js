import express from "express";
import ConsultantsController from "../controllers/consultants.controller.js";

const consultantsRouter = express.Router();

consultantsRouter.use((req, res, next) => {
  console.log("여기는 consultants 미들웨어");
  next();
});

consultantsRouter
  .route("/")
  .get(ConsultantsController.getAll)
  .post((req, res) => {
    res.json({ message: "Consultants 추가" });
  });

consultantsRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Consultants 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Consultants 삭제" });
  });

export default consultantsRouter;