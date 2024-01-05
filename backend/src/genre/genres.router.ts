import express from "express";
import { getGenres } from "./genre.controller";
import { verifyToken } from "../user/user.controller";

const router = express.Router();

router.get("/getAll", verifyToken, getGenres);

export { router as genresRouter };
