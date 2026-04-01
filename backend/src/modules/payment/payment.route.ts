import express from "express";
import {
  createOrderController,
  createSubscriptionController,
  verifyPaymentController,
} from "./payment.controller.js";
import { handleWebHook } from "./payment.webhook.js";

const router = express.Router();

router.route("/create-order").post(createOrderController);
router.route("/verify").post(verifyPaymentController);
router.route("/create-subscription").post(createSubscriptionController);

export default router;
