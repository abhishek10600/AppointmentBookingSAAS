import express from "express";
import {
  cancelBookingController,
  createBookingController,
  getBookingController,
  getOrganizationBookingsController,
  getServiceBookingsController,
} from "./booking.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(createBookingController);
router.route("/:bookingId").patch(cancelBookingController);
router.route("/:bookingId").get(getBookingController);
router
  .route("/organization/:organizationId")
  .get(authMiddleware, getOrganizationBookingsController);
router
  .route("/service/:serviceId")
  .get(authMiddleware, getServiceBookingsController);

export default router;
