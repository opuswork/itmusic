import express from "express";
import VideoController from "../controllers/video.controller.js";

const videoRouter = express.Router();

videoRouter.use((req, res, next) => {
  console.log("여기는 videos 미들웨어");
  next();
});

videoRouter
  .route("/")
  .get(VideoController.getAll)
  .post((req, res) => {
    res.json({ message: "Video 추가" });
  });

videoRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Video 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Video 삭제" });
  });

export default videoRouter;