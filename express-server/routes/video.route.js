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
  .post(VideoController.create);

videoRouter
  .route("/:id")
  .get(VideoController.getOne)
  .put(VideoController.update)
  .patch(VideoController.update)
  .delete(VideoController.remove);

export default videoRouter;