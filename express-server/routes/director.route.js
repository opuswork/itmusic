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
  .post((req, res) => {
    res.json({ message: "Director 추가" });
  });

directorRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Director 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Director 삭제" });
  });

export default directorRouter;