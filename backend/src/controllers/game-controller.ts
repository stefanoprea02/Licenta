import { RequestHandler } from "express";
import Game from "../models/Game";

const getGames: RequestHandler = async (req, res, next) => {
  try {
    const allGames = await Game.find({});

    return res.status(200).json({ game: allGames });
  } catch (err) {
    console.log(err);
  }
};

const uploadGame: RequestHandler = async (req, res, next) => {
  return res.status(200);
};

export { getGames, uploadGame };
