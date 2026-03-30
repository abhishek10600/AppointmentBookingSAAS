import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getGoogleStatus,
  googleAuth,
  googleCallback,
} from "./google.controller.js";

const router = express.Router();

// router.route("/connect").get(googleAuth);
router.get("/connect", googleAuth);
router.route("/callback").get(googleCallback);
router.route("/status").get(getGoogleStatus);

export default router;
