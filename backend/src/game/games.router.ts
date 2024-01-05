import express from "express";
import { verifyToken } from "../user/user.controller";
import { getGames, uploadDraft, uploadGame } from "./game.controller";
import multer from "multer";
import { validator } from "../utils/validator";
import { uploadDraftValidator } from "./game.validators";

const router = express.Router();

const uploadImages = multer({ dest: "images/" });

router.get("/getAll", verifyToken, getGames);
router.post("/upload", verifyToken, uploadGame);
router.post(
  "/uploadDraft",
  verifyToken,
  uploadImages.array("images", 12),
  uploadDraftValidator,
  validator,
  uploadDraft
);

export { router as gamesRouter };
