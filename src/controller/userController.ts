import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import formidable from "formidable";
import path from "path";
import { prismaClient } from "../index.ts";
import multer from "multer";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await prismaClient.user.findMany();

  if (!user) {
    throw Error("Error getting User");
  }
  res.sendFile(path.join(__dirname, "dist/index.html"), (err) => {
    if (err) {
      console.log("Error Sending file", err);
    } else {
      console.log("Sent: ", path.join(__dirname, "dist/index.html"));
    }
  });
};

export const createUsers = async (req: Request, res: Response) => {
  const error = validationResult(req);

  const { firstName, lastName, email, rollNo, faculty, phoneNumber } = req.body;

  const paymentSlip = req.files!.paymentSlip;
  const eventId = req.query.eventId;

  console.log(eventId);

  try {
    // Checking whether there are any errors in input

    if (!error.isEmpty()) {
      const errors = { message: error.array()[0].msg };
      //@ts-ignore
      errors.statusCode = 500;
      throw error;
    }

    // Checking whether the user exists or not
    const userCheck = await prismaClient.user.findFirst({
      where: { email, rollNo },
    });

    if (userCheck) {
      throw Error("User already created!");
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
      },
    });

    // Also create a relation between the user and the event
    const eventCreate = await prismaClient.userEventRoles.create({
      data: {
        userId: user.id,
        eventId: +eventId!,
      },
    });

    // use this for checking whether the event is free or PAID and also to check whether the users paymentStatus is PAID or not
    const event = await prismaClient.event.findFirst({
      where: { id: +eventId! },
    });

    // checking and uploading the file into the storage

    if (event?.entryStatus === "PAID") {
      if (eventCreate?.paymentStatus === "NOT_PAID") {
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
  } catch (err) {
    console.log(err);
  }
};

// export const postPayment = async (req: Request, res: Response) => {
//   try {
//     let cancelUploads = false;
//     let options;
//     const form = formidable(options);

//     await form.parse(req, async (err, fileds, files) => {
//       // console.log(req.body, fileds, files);

//       const { rollNo, email } = fileds;

//       console.log(rollNo[0].toString(), email);

//       const user = await prismaClient.user.findFirst({
//         where: { rollNo: rollNo[0].toString(), email: email[0].toString() },
//       });
//       console.log(user);

//       const userEventRole = await prismaClient.userEventRoles.findFirst({
//         where: { id: user?.id },
//       });

//       console.log(userEventRole);

//       console.log(userEventRole?.paymentStatus);

//       if (userEventRole?.paymentStatus === "NOT_PAID") {
//         form.on("fileBegin", function (formname, file) {
//           formname =
//             user?.firstName! +
//             "_" +
//             "paymentSlip" +
//             "_" +
//             Date.now() +
//             file.mimetype;
//           file.filepath = path.join(__dirname, "..", "public");
//         });

//         // const form = formidable({
//         //   uploadDir: path.join(__dirname, "..", "public"),

//         //   filename(name, ext, part) {
//         //     // console.log(ext);
//         //     const uniqueFileName =
//         //       user?.firstName! + "_" + "paymentSlip" + "_" + Date.now() + ext;
//         //     return uniqueFileName;
//         //   },
//         // });

//         // form.parse(req, async (err, fields, files) => {
//         //   //@ts-ignore
//         //   const fileName = files.paymentSlip[0].newFilename;

//         //   await prismaClient.userEventRoles.update({
//         //     where: { userId: user?.id },
//         //     data: {
//         //       paymentSlip: fileName,
//         //       paymentStatus: "PAID",
//         //     },
//         //   });
//         // });

//         res.json({ message: "The file is uploaded successfully" });
//       } else {
//         return res.json({ message: "You have already submitted the slip" });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const postPayment = async (req: Request, res: Response) => {
  const { rollNo, email } = req.body;
  const paymentSlip = req.files;
  if (req.files) {
    console.log(paymentSlip, rollNo, email);
    const file = req.files.paymentSlip;
    const fileName = file.name;
    const newFileName =
      Date.now() + "_" + "paymentSlip" + file.mimetype.replace("image/", ".");

    let uploadPath = path.join(__dirname, "..", "/public/") + newFileName;

    file.mv(uploadPath, function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json("File Uploaded successfully");
      }
    });

    return res.json("success");
  }

  return res.json(rollNo);
};
