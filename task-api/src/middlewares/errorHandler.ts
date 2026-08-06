import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomError } from "@/utils/customError";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod Validation Error (Input Validasi Client)
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validasi data gagal",
      errors: issues,
    });
  }

  // 1. Mongoose Bad ObjectId
  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID format is invalid (Data not found)",
    });
  }

  // 2. Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `Data with ${field} already exists. Please use a different ${field}`,
    });
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: message,
    });
  }

  // 4. Express JSON Syntax Error
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  // Catat error
  logger.error(`[Unhandled Error] ${err.message}`, err);

  // 5. Fallback Internal Server Error
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    // Trik Enterprise: Tampilkan detail error HANYA JIKA kita sedang tahap ngoding (development)!
    ...(process.env.NODE_ENV === "development" && { errorDetail: err.message }),
  });
};
