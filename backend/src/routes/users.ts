import express from "express";
import {
  signup,
  signin,
  verifyToken,
  getUser,
  refreshToken,
  logout,
} from "../controllers/user-controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

export { router as usersRouter };
