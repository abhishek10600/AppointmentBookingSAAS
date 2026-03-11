import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createServiceController } from "./service.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createServiceController);

export default router;
