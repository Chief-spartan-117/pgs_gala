import type { Request, Response } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { prismaClient } from "../index.ts";

export const loginVerify = async (req: Request, res: Response) => {
  const { rollNo, email, otp } = req.body;

  const user = await prismaClient.user.findFirst({
    where: { rollNo, email },
  });

  const role = await prismaClient.userEventRoles.findFirst({
    where: { userId: user?.id },
  });

  if (role?.roleId !== 3 && role?.twoFaVerified === false) {
    const verify = speakeasy.totp.verify({
      secret: role.twoFaVerifyKey!,
      encoding: "ascii",
      token: otp,
    });

    if (verify) {
      await prismaClient.userEventRoles.update({
        where: {
          userId: user?.id,
        },
        data: {
          twoFaVerified: true,
        },
      });
    }

    res.json(verify);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { rollNo, email, otp } = req.body;

  const user = await prismaClient.user.findFirst({
    where: { rollNo, email },
  });

  const role = await prismaClient.userEventRoles.findFirst({
    where: { userId: user?.id },
  });

  if (role?.roleId !== 3 && role?.twoFaVerified === false) {
    const secret = speakeasy.generateSecret({
      name: "PGS Gala",
    });

    // @ts-ignore
    qrcode.toDataURL(secret.otpauth_url, async (err, data) => {
      console.log(secret);

      await prismaClient.userEventRoles.update({
        where: {
          userId: user?.id,
        },
        data: {
          twoFaVerifyKey: secret.ascii,
        },
      });

      res.json({ qrcode: data, key: secret.ascii });
    });
    // console.log(secret);
  } else {
    const verify = speakeasy.totp.verify({
      secret: role?.twoFaVerifyKey!,
      encoding: "ascii",
      token: otp,
    });

    if (verify) {
    }
  }

  // res.json({ message: "User login" });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.userEventRoles.findMany();

    if (!users) {
      throw Error("No Users Found");
    }

    return res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prismaClient.role.findMany();

    if (!roles) {
      console.log("No roles to display");
    }
    return res.status(200).json(roles);
  } catch (err) {
    console.log(err);
  }
};

export const postRoles = async (req: Request, res: Response) => {
  try {
    const role = req.body.roles;

    const roles = await prismaClient.role.create({
      data: {
        role: role,
      },
    });

    return res.status(201).json(roles);
  } catch (err) {
    console.log(err);
  }
};

export const postEvent = async (req: Request, res: Response) => {
  try {
    const eventName = req.body.eventName;
    const entryStatus = req.body.entryStatus;

    if (!eventName) {
      throw Error("No Event name provided!");
    }

    const event = await prismaClient.event.create({
      data: {
        event: eventName,
        entryStatus: entryStatus,
      },
    });
    return res.status(201).json(event);
  } catch (err) {
    console.log(err);
  }
};
