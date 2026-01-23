import express from "express";
import AuthController from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", AuthController.getCurrentUser);
authRouter.get("/kakao", AuthController.kakaoLogin);
authRouter.get("/kakao/callback", AuthController.kakaoCallback);

export default authRouter;
