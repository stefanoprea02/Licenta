import { RequestHandler } from "express";
import Game from "./game.entity";

const getGames: RequestHandler = async (req, res, next) => {
  try {
    const allGames = await Game.find({});

    return res.status(200).json({ game: allGames });
  } catch (err) {
    console.log(err);
  }
};

const uploadDraft: RequestHandler = async (req, res, next) => {
  return res.status(200);
};

const uploadGame: RequestHandler = async (req, res, next) => {
  return res.status(200);
};

export { getGames, uploadGame };
