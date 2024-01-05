import { NextFunction, Request, RequestHandler } from "express";
import Game from "./game.entity";
import { TypedResponse } from "../utils/web";
import { GetGameDTO } from "./game.types";

const getGames = async (
  _req: Request,
  res: TypedResponse<GetGameDTO[]>,
  _next: NextFunction
) => {
  try {
    const allGames = await Game.find({});

    return res.status(200).json([...allGames]);
  } catch (err) {
    console.log(err);
  }
};

const uploadDraft: RequestHandler = async (_req, res, _next) => {
  return res.status(200);
};

const uploadGame: RequestHandler = async (_req, res, _next) => {
  return res.status(200);
};

export { getGames, uploadGame, uploadDraft };
