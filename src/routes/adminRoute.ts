import express from "express";
const router = express.Router();

import {
  getRoles,
  getUsers,
  postEvent,
  postRoles,
  loginUser,
  loginVerify,
} from "../controller/adminController.ts";

router.post("/login-verify", loginVerify);

router.post("/login", loginUser);

router.get("/", getUsers);

router.get("/roles", getRoles);
router.post("/roles", postRoles);

router.post("/event", postEvent);

export default router;
