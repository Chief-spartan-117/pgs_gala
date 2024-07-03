import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import path from "path";
import { prismaClient } from "../index.ts";
import AppError from "../utils/appError.ts";
import { catchAsync } from "./../utils/catchAsync.ts";
import { user_in_college } from "../users.ts";

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await prismaClient.user.findMany();
    // if (!user) {
    //   throw Error("Error getting User");
    // }
    // res.json(user_in_college);
    res.send("index.html");
  }
);

export const getUsersDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    const { rollNo, faculty } = req.body;

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

    return res.json(userDetail);
  }
);

export const updateUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    const {
      firstName,
      lastName,
      email,
      rollNo,
      faculty,
      phoneNumber,
      paymentMethod,
    } = req.body;

    console.log(req.body);

    const paymentSlip =
      paymentMethod === "Cash" ? "Cash" : req.files!.paymentSlip;
    const eventId = req.query.eventId;

    // console.log(eventId);

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
        // This will create a relation between user and the event
        // userEventRoles: {
        //   create: {
        //     eventId: +eventId!,
        //   },
        // },
      },
      // include: {
      //   userEventRoles: true,
      // },
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
      next(new AppError("User already registered", 403));
    }

    console.log("userIsInEvent Check", userIsInEvent);

    // use this for checking whether the event is free or PAID and also to check whether the users paymentStatus is PAID or not
    const event = await prismaClient.event.findFirst({
      where: { id: +eventId! },
    });

    // checking and uploading the file into the storage

    if (event?.entryStatus === "PAID") {
      if (
        userIsInEvent!.paymentStatus === "NOT_PAID" &&
        paymentMethod !== "Cash"
      ) {
        // @ts-ignore
        if (paymentSlip.mimetype.split("/")[0] === "image") {
          const newFileName =
            user.firstName +
            "_" +
            Date.now() +
            "_" +
            "paymentSlip" +
            // @ts-ignore
            paymentSlip.mimetype.replace("image/", ".");

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
              return res.json("File Uploaded successfully");
            }
          });
          // @ts-ignore
        } else if (paymentSlip.mimetype === "application/pdf") {
          const newFileName =
            user.firstName +
            "_" +
            Date.now() +
            "_" +
            "paymentSlip" +
            // @ts-ignore
            paymentSlip.mimetype.replace("application/", ".");

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
              return res.json("File Uploaded successfully");
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
              paymentStatus: "NOT_PAID_AND_CASH",
              paymentSlip: "Cash",
            },
          })
          .then(() => {
            return res.json("User Registerd Successfully");
          });
        return next(new AppError("You have already submitted the slip", 403));
      }
    } else {
      return res.json(user);
    }
  }
);

// export const postPayment = async (req: Request, res: Response) => {
//   const { rollNo, email } = req.body;
//   const paymentSlip = req.files;
//   if (req.files) {
//     console.log(paymentSlip, rollNo, email);
//     const file = req.files.paymentSlip;
//     const fileName = file.name;
//     const newFileName =
//       Date.now() + "_" + "paymentSlip" + file.mimetype.replace("image/", ".");

//     let uploadPath = path.join(__dirname, "..", "/public/") + newFileName;

//     file.mv(uploadPath, function (err) {
//       if (err) {
//         res.json(err);
//       } else {
//         res.json("File Uploaded successfully");
//       }
//     });

//     return res.json("success");
//   }

//   return res.json(rollNo);
// };
