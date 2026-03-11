import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createOrg,
  getMyOrgs,
  getOrgBySlug,
} from "./organization.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createOrg);
router.route("/my-organizations").get(authMiddleware, getMyOrgs);
router.route("/:slug").get(getOrgBySlug);

export default router;
