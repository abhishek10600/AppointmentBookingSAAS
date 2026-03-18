import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { oauth2Client, SCOPES } from "../../lib/google.js";
import { google } from "googleapis";
import { prisma } from "../../lib/prisma.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  //   const organizationId = req.body.organizationId as string;
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    // state: req.user?.organizationId,
    state: "2356284c-39d4-474d-9588-ce77ab2ac0d0",
    // state: organizationId,
  });

  res.redirect(url);
});

export const googleCallback = catchAsync(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    console.log({ code });

    const { tokens } = await oauth2Client.getToken(code);
    console.log({ tokens });

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    console.log({ userInfo });

    const organizationId = req.query.state as string;

    await prisma.googleIntegration.upsert({
      where: {
        organizationId,
      },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: new Date(tokens.expiry_date!),
      },
      create: {
        organizationId,
        googleEmail: userInfo.data.email!,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: new Date(tokens.expiry_date!),
      },
    });

    res.status(200).json({
      success: true,
      data: "Google connected successfully",
    });
  }
);
