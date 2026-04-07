import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { oauth2Client, SCOPES } from "../../lib/google.js";
import { google } from "googleapis";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  // const organizationId = req.body.organizationId as string;
  const organizationId = req.query.organizationId as string;

  if (!organizationId) {
    throw new ApiError(400, "Organization Id is required");
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    include_granted_scopes: false,
    // state: req.user?.organizationId,
    // state: "eface8e7-f4e4-4076-be1d-56941cd6cade",
    state: organizationId,
  });

  res.redirect(url);
});

export const googleCallback = catchAsync(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    // console.log({ code });

    if (!code) {
      throw new ApiError(400, "Authorization code missing.");
    }

    const { tokens } = await oauth2Client.getToken(code);
    // console.log({ tokens });

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    // console.log({ userInfo });

    const organizationId = req.query.state as string;

    if (!organizationId) {
      throw new ApiError(400, "Invalid state");
    }

    await prisma.googleIntegration.upsert({
      where: {
        organizationId,
      },
      update: {
        accessToken: tokens.access_token!,
        expiryDate: new Date(tokens.expiry_date!),
        ...(tokens.refresh_token && {
          refreshToken: tokens.refresh_token,
        }),
      },
      create: {
        organizationId,
        googleEmail: userInfo.data.email!,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: new Date(tokens.expiry_date!),
      },
    });

    return res.redirect(
      `${process.env.CORS_ORIGINS}/dashboard/integrations?success=true`
    );

    // res.status(200).json({
    //   success: true,
    //   data: "Google connected successfully",
    // });
  }
);

export const getGoogleStatus = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.query.organizationId as string;

    if (!organizationId) {
      throw new ApiError(400, "Organization Id is requred");
    }

    const googleIntegration = await prisma.googleIntegration.findUnique({
      where: {
        organizationId,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        connected: !!googleIntegration,
        email: googleIntegration?.googleEmail,
      },
    });
  }
);
