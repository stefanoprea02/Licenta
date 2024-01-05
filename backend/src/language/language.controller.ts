import Language from "./language.entity";
import { TypedResponse } from "../utils/web";
import { GetLanguageDTO } from "./language.types";
import { NextFunction, Request } from "express";

const getLanguages = async (
  _req: Request,
  res: TypedResponse<GetLanguageDTO[]>,
  _next: NextFunction
) => {
  try {
    const allLanguages = await Language.find({}, "language");

    return res.status(200).json([...allLanguages]);
  } catch (err) {
    console.log(err);
  }
};

export { getLanguages };
