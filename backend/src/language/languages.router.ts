import express from "express";
import { verifyToken } from "../user/user.controller";
import { getLanguages } from "./language.controller";

const router = express.Router();

router.get("/getAll", verifyToken, getLanguages);

export { router as languagesRouter };
