import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma duplicate error
  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // Zod validation error
  if (err instanceof ZodError) {
    // console.log(err);
    statusCode = 400;
    message = err.issues.map((e) => e.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
