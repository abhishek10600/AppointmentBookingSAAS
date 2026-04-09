import express from "express";
import { getMe, login, logout, refresh, register } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { logoutUser } from "./auth.service.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/me").get(authMiddleware, getMe);

export default router;
