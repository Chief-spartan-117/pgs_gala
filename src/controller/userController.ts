import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import path from "path";
import { prismaClient } from "../index.ts";
import AppError from "../utils/appError.ts";
import { catchAsync } from "./../utils/catchAsync.ts";
import { userData } from "../../users.ts";

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prismaClient.user.findMany();

    if (!user) {
      throw Error("Error getting User");
    }
    res.json(userData.BBA);
  }
);

export const createUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    const { firstName, lastName, email, rollNo, faculty, phoneNumber } =
      req.body;

    const paymentSlip = req.files!.paymentSlip;
    const eventId = req.query.eventId;

    // console.log(eventId);

    // Checking whether there are any errors in input

    if (!error.isEmpty()) {
      return next(new AppError(error.array()[0].msg, 400));
    }

    // Checking whether the user exists or not
    const userCheck = await prismaClient.user.findFirst({
      where: { email, rollNo },
    });

    if (userCheck) {
      return next(new AppError("User already exists!", 403));
    }

    // if the user does not exist then we create the user
    const user = await prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        rollNo,
        faculty,
        phoneNumber,
        // This will create a relation between user and the event
        userEventRoles: {
          create: {
            eventId: +eventId!,
          },
        },
      },
      include: {
        userEventRoles: true,
      },
    });

    // // Also create a relation between the user and the event
    // const eventCreate = await prismaClient.userEventRoles.create({
    //   data: {
    //     userId: user.id,
    //     eventId: +eventId!,
    //   },
    // });

    // use this for checking whether the event is free or PAID and also to check whether the users paymentStatus is PAID or not
    const event = await prismaClient.event.findFirst({
      where: { id: +eventId! },
    });

    // checking and uploading the file into the storage

    if (event?.entryStatus === "PAID") {
      if (user.userEventRoles[0].paymentStatus === "NOT_PAID") {
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
                  userId: user.id,
                },
                data: {
                  paymentSlip: newFileName,
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
                  userId: user.id,
                },
                data: {
                  paymentSlip: newFileName,
                },
              });
              return res.json("File Uploaded successfully");
            }
          });
        } else {
          return res.json("Invalid File type");
        }
      } else {
        return res.json({ message: "You have already submitted the slip" });
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
