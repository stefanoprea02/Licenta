import express from "express";
import { verifyToken } from "../controllers/user-controller";
import { getTags } from "../controllers/tag-controller";

const router = express.Router();

router.get("/getAll", verifyToken, getTags);

export { router as tagsRouter };
