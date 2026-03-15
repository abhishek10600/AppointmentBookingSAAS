import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAvailableSlotsController } from "./slot.controller.js";

const router = express.Router();

router.route("/").get(getAvailableSlotsController);

export default router;
