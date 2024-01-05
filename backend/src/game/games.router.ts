import express from "express";
import { verifyToken } from "../user/user.controller";
import { getGames, uploadGame } from "./game.controller";

const router = express.Router();

router.get("/getAll", verifyToken, getGames);
router.post("/upload", verifyToken, uploadGame);

export { router as gamesRouter };
