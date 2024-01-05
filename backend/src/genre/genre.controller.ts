import { RequestHandler } from "express";

import Genre from "./genre.entity";

const getGenres: RequestHandler = async (req, res, next) => {
  try {
    const allGenres = await Genre.find({}, "genre");

    return res.status(200).json({ genres: allGenres });
  } catch (err) {
    console.log(err);
  }
};

export { getGenres };
