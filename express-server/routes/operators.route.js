import express from "express";
import OperatorsController from "../controllers/operators.controller.js";

const operatorsRouter = express.Router();

operatorsRouter.use((req, res, next) => {
  console.log("여기는 operators 미들웨어");
  next();
});

operatorsRouter
  .route("/")
  .get(OperatorsController.getAll)
  .post((req, res) => {
    res.json({ message: "Operators 추가" });
  });

operatorsRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Operators 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Operators 삭제" });
  });

export default operatorsRouter;