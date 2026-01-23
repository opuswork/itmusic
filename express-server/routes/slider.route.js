import express from "express";
import SliderController from "../controllers/slider.controller.js";

const sliderRouter = express.Router();

sliderRouter.use((req, res, next) => {
  console.log("여기는 sliders 미들웨어");
  next();
});

sliderRouter
  .route("/")
  .get(SliderController.getAll)
  .post((req, res) => {
    res.json({ message: "Slider 추가" });
  });

sliderRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Slider 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Slider 삭제" });
  });

export default sliderRouter;
