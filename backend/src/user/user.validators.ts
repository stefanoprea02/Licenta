import { body } from "express-validator";

const registerValidator = [
  body("username")
    .isString()
    .isLength({ min: 5, max: 20 })
    .withMessage(
      "Username must be a string with length between 5 and 20 characters"
    ),
  body("email").isString().isEmail().withMessage("Invalid email format"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

const loginValidator = [
  body("username")
    .isString()
    .isLength({ min: 5, max: 20 })
    .withMessage(
      "Username must be a string with length between 5 and 20 characters"
    ),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export { registerValidator, loginValidator };
