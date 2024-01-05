import express from "express";
import { verifyToken } from "../user/user.controller";
import { getPlatforms } from "./platform.controller";

const router = express.Router();

router.get("/getAll", verifyToken, getPlatforms);

export { router as platformsRouter };
