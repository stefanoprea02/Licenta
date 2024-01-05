import Tag from "./tag.entity";
import { TypedResponse } from "../utils/web";
import { GetTagDTO } from "./tag.types";
import { NextFunction, Request } from "express";

const getTags = async (
  _req: Request,
  res: TypedResponse<GetTagDTO[]>,
  _next: NextFunction
) => {
  try {
    const allTags = await Tag.find({}, "tag");

    return res.status(200).json([...allTags]);
  } catch (err) {
    console.log(err);
  }
};

export { getTags };
