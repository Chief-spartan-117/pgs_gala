import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import path from "node:path";
import { prismaClient } from "../index.ts";
import AppError from "../utils/appError.ts";
import { catchAsync } from "./../utils/catchAsync.ts";

export const getUsersDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    const { rollNo } = req.body;

    if (!error.isEmpty()) {
      return next(new AppError(error.array()[0].msg, 400));
    }

    const userDetail = await prismaClient.user.findFirst({
      where: {
        rollNo: rollNo,
      },
    });

    if (!userDetail) {
      return next(new AppError("User Not Found", 403));
    }

    return res.json({
      faculty: userDetail.faculty,
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
    });
  }
);

export const updateUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    const { email, rollNo, phoneNumber, paymentMethod } = req.body;

    const paymentSlip =
      paymentMethod === "Cash" ? "Cash" : req.files?.paymentSlip;
    const eventId = req.query.eventId;

    // Checking whether there are any errors in input

    if (!error.isEmpty()) {
      return next(new AppError(error.array()[0].msg, 400));
    }

    // Checking whether the user exists or not
    const userCheck = await prismaClient.user.findFirst({
      where: { rollNo },
    });

    if (!userCheck) {
      return next(new AppError("User does not exists!", 403));
    }

    // if the user does not exist then we update the user
    const user = await prismaClient.user.update({
      where: {
        rollNo: rollNo,
      },
      data: {
        email: email,
        phoneNumber: phoneNumber,
      },
    });

    // Also create a relation between the user and the event

    const userInEvent = await prismaClient.userEventRoles.findFirst({
      where: {
        userId: user.id,
        eventId: +eventId!,
      },
    });

    let userIsInEvent;

    if (!userInEvent) {
      userIsInEvent = await prismaClient.userEventRoles.create({
        data: {
          userId: user.id,
          eventId: +eventId!,
        },
      });
    } else {
      return next(new AppError("User already registered", 403));
    }

    // use this for checking whether the event is free or PAID and also to check whether the users paymentStatus is PAID or not
    const event = await prismaClient.event.findFirst({
      where: { id: +eventId! },
    });

    // checking and uploading the file into the storage

    if (event?.entryStatus === "PAID") {
      if (
        userIsInEvent?.paymentStatus === "NOT_PAID" &&
        paymentMethod !== "Cash"
      ) {
        // @ts-ignore
        if (paymentSlip.mimetype.split("/")[0] === "image") {
          const newFileName = `${
            user.firstName
            // @ts-ignore
          }_${Date.now()}_paymentSlip${paymentSlip!.mimetype.replace(
            "image/",
            "."
          )}`;

          let uploadPath = path.join(__dirname, "..", "/public/") + newFileName;

          // @ts-ignore
          paymentSlip.mv(uploadPath, async function (err) {
            if (err) {
              return res.json(err);
            } else {
              await prismaClient.userEventRoles.update({
                where: {
                  id: userIsInEvent!.id,
                  userId: user.id,
                  eventId: +eventId!,
                },
                data: {
                  paymentSlip: newFileName,
                  paymentStatus: "PAID",
                },
              });
              return res.json({
                status: "success",
                message: "User Registered Successfully",
              });
            }
          });
          // @ts-ignore
        } else if (paymentSlip.mimetype === "application/pdf") {
          const newFileName = `${
            user.firstName
            // @ts-ignore
          }_${Date.now()}_paymentSlip${paymentSlip!.mimetype.replace(
            "application/",
            "."
          )}`;

          let uploadPath = path.join(__dirname, "..", "/public/") + newFileName;

          // @ts-ignore
          paymentSlip.mv(uploadPath, async (err) => {
            if (err) {
              return res.json(err);
            } else {
              await prismaClient.userEventRoles.update({
                where: {
                  id: userIsInEvent!.id,
                  userId: user.id,
                  eventId: +eventId!,
                },
                data: {
                  paymentSlip: newFileName,
                  paymentStatus: "PAID",
                },
              });
              return res.json({
                status: "success",
                message: "User Registered Successfully",
              });
            }
          });
        } else {
          return next(new AppError("Invalid File type", 400));
        }
      } else {
        await prismaClient.userEventRoles
          .update({
            where: {
              id: userIsInEvent!.id,
              userId: user.id,
              eventId: +eventId!,
            },
            data: {
              paymentSlip: "Cash",
              paymentStatus: "NOT_PAID_AND_CASH",
            },
          })
          .then(() => {
            return res.json({
              status: "success",
              message: "User Registerd Successfully",
            });
          });
        return next(new AppError("You have already submitted the slip", 403));
      }
    } else {
      return res.json({
        status: "success",
        message: "You are Registered to the event.",
      });
    }
  }
);
