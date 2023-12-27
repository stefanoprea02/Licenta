import express from "express";
import { getGenres } from "../controllers/genre-controller";
import { verifyToken } from "../controllers/user-controller";

const router = express.Router();

router.get("/getAll", verifyToken, getGenres);

export { router as genresRouter };
