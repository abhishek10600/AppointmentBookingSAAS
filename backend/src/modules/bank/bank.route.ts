import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getUserBankDetailController,
  upsertBankDetailController,
} from "./bank.controller.js";

export const router = express.Router();

router.route("/").post(authMiddleware, upsertBankDetailController);
router.route("/").get(authMiddleware, getUserBankDetailController);

export default router;
