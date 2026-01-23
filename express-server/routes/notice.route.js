import express from "express";
import NoticeController from "../controllers/notice.controller.js";

const noticeRouter = express.Router();

noticeRouter.use((req, res, next) => {
  console.log("여기는 notices 미들웨어");
  next();
});

noticeRouter
  .route("/")
  .get(NoticeController.getAll)
  .post((req, res) => {
    res.json({ message: "Notice 추가" });
  });

noticeRouter
  .route("/:id")
  .patch((req, res) => {
    res.json({ message: "Notice 수정" });
  })
  .delete((req, res) => {
    res.json({ message: "Notice 삭제" });
  });

export default noticeRouter;