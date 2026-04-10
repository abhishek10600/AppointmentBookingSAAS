import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  changePasswordController,
  forgotPasswordController,
  resetPasswordWithTokenController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/me").get(authMiddleware, getMe);
router.route("/change-password").post(authMiddleware, changePasswordController);
router.route("/forgot-password").post(forgotPasswordController);
router.route("/reset-password-token").post(resetPasswordWithTokenController);

export default router;
