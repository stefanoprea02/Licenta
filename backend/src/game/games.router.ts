import express from "express";
import { verifyToken } from "../user/user.controller";
import {
  editDraft,
  getGameById,
  getGames,
  uploadDraft,
  uploadGame,
} from "./game.controller";
import multer from "multer";
import { validator } from "../utils/validator";
import { uploadDraftValidator } from "./game.validators";

const router = express.Router();

const uploadImages = multer({ dest: "images/" });
const uploadGames = multer({ dest: "games/" });

router.get("/getAll", verifyToken, getGames);
router.get("/getGameById", verifyToken, getGameById);
router.post("/uploadGame", verifyToken, uploadGames.single("game"), uploadGame);
router.post(
  "/uploadDraft",
  verifyToken,
  uploadImages.array("images", 12),
  uploadDraftValidator,
  validator,
  uploadDraft
);
router.post(
  "/editDraft",
  verifyToken,
  uploadImages.array("images", 12),
  uploadDraftValidator,
  validator,
  editDraft
);

export { router as gamesRouter };
