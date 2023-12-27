import { RequestHandler } from "express";

import Language from "../models/Language";

const getLanguages: RequestHandler = async (req, res, next) => {
  try {
    const allLanguages = await Language.find({}, "language");

    return res.status(200).json({ languages: allLanguages });
  } catch (err) {
    console.log(err);
  }
};

export { getLanguages };
