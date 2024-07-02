import type { Request, Response, NextFunction } from "express";

export default (
  err: { statusCode: number; status: string; message: string },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
