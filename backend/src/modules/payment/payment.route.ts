import express from "express";
import {
  createOrderController,
  verifyPaymentController,
} from "./payment.controller.js";

const router = express.Router();

router.route("/create-order").post(createOrderController);
router.route("/verify").post(verifyPaymentController);

export default router;
