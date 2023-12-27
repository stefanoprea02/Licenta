import express from "express";
import { verifyToken } from "../controllers/user-controller";
import { getPlatforms } from "../controllers/platform-controller";

const router = express.Router();

router.get("/getAll", verifyToken, getPlatforms);

export { router as platformsRouter };
