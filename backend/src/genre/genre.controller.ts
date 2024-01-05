import Genre from "./genre.entity";
import { TypedResponse } from "../utils/web";
import { GetGenreDTO } from "./genre.types";
import { NextFunction, Request } from "express";

const getGenres = async (
  _req: Request,
  res: TypedResponse<GetGenreDTO[]>,
  _next: NextFunction
) => {
  try {
    const allGenres = await Genre.find({}, "genre");

    return res.status(200).json([...allGenres]);
  } catch (err) {
    console.log(err);
  }
};

export { getGenres };
