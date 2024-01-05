import express from "express";
import { verifyToken } from "../user/user.controller";
import { getTags } from "./tag.controller";

const router = express.Router();

router.get("/getAll", verifyToken, getTags);

export { router as tagsRouter };
