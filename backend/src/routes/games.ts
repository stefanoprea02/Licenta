import express from "express";
import { verifyToken } from "../controllers/user-controller";
import { getGames, uploadGame } from "../controllers/game-controller";

const router = express.Router();

router.get("/getAll", verifyToken, getGames);
router.post("/upload", verifyToken, uploadGame);

export { router as gamesRouter };
