import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { googleAuth, googleCallback } from "./google.controller.js";

const router = express.Router();

// router.route("/connect").get(authMiddleware, googleAuth);

// for testing only
router.route("/connect").get(googleAuth);
router.route("/callback").get(googleCallback);

export default router;
