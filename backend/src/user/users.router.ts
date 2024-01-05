import express, { NextFunction, Request, Response } from "express";
import {
  signup,
  signin,
  verifyToken,
  getUser,
  refreshToken,
  logout,
} from "./user.controller";
import { loginValidator, registerValidator } from "./user.validators";
import { validator } from "../utils/validator";

const router = express.Router();

router.post(
  "/signup",
  function (req: Request, _res: Response, next: NextFunction) {
    console.log(req.body);
    next();
  },
  registerValidator,
  validator,
  signup
);
router.post("/signin", loginValidator, validator, signin);
router.get("/user", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

export { router as usersRouter };
