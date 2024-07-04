import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const sendErrorDev = (
  err: {
    isOperational: boolean;
    stack: any;
    statusCode: number;
    status: string;
    message: string;
  },
  res: Response
) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: {
    isOperational: boolean;
    stack: any;
    statusCode: number;
    status: string;
    message: string;
  },
  res: Response
) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);

    res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

export default (
  err: {
    isOperational: boolean;
    stack: any;
    statusCode: number;
    status: string;
    message: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "Developement") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "Production") {
    sendErrorProd(err, res);
  }
};
