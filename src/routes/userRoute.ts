import express from "express";
import { body } from "express-validator";
import {
  createUsers,
  getUsers,
  postPayment,
} from "../controller/userController.ts";
import multer from "multer";
const upload = multer();

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Used to reterive all user
 *     description: Returns all users
 *     responses:
 *       200:
 *         description: To get all the users
 */
router.get("/", getUsers);

/**
 * @swagger
 *  components:
 *         schema:
 *              User:
 *                  type: object
 *                  properties:
 *                            id:
 *                              type: integer
 *                            name:
 *                              type: string
 *                            email:
 *                               type: string
 *                            rollNo:
 *                                type: string
 *                            year:
 *                                type: integer
 *                            faculty:
 *                                 type: string
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Used to register user
 *     description: This route is used to register user
 *     requestBody:
 *              required: true
 *              content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schema/User'
 *
 *     responses:
 *       200:
 *         description: To get all the users
 */

router.post(
  "/register",
  [
    body("firstName", "Please provide your First Name")
      .trim()
      .isLength({ min: 2 })
      .escape(),

    body("lastName", "Please provide your Last name")
      .trim()
      .isLength({ min: 2 })
      .escape(),

    body("email", "Please provide a vaild email")
      .trim()
      .isEmail({ domain_specific_validation: true })
      .custom((value) => {
        const emailDomain = value.split("@")[1];
        const domainPattern = ["westcliff.edu"];
        if (!domainPattern.includes(emailDomain)) {
          throw new Error("Email domain must be " + domainPattern);
        }
        return true;
      })
      .escape(),
    body("rollNo", "Please provide a valid Roll No")
      .trim()
      .escape()
      .isLength({ min: 2, max: 8 }),

    body("faculty", "Please provide your faculty").trim().escape(),
    body("phoneNumber", "Please provide a valid phone Number")
      .trim()
      .isMobilePhone("ne-NP")
      .isLength({ min: 10, max: 10 })
      .escape(),
    body("paymentSlip", "Please provide a valid Slip").trim().escape(),
  ],
  createUsers
);

router.post("/payment", postPayment);

export default router;
