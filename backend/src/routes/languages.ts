import express from "express";
import { verifyToken } from "../controllers/user-controller";
import { getLanguages } from "../controllers/language-controller";

const router = express.Router();

router.get("/getAll", verifyToken, getLanguages);

export { router as languagesRouter };
