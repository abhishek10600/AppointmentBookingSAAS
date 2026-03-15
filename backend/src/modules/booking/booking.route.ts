import express from "express";
import { createBookingController } from "./booking.controller.js";

const router = express.Router();

router.route("/").post(createBookingController);

export default router;
