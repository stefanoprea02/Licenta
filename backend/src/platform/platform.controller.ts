import Platform from "./platform.entity";
import { TypedResponse } from "../utils/web";
import { GetPlatformDTO } from "./platform.types";
import { NextFunction, Request } from "express";

const getPlatforms = async (
  _req: Request,
  res: TypedResponse<GetPlatformDTO[]>,
  _next: NextFunction
) => {
  try {
    const allPlatforms = await Platform.find({}, "platform");

    return res.status(200).json([...allPlatforms]);
  } catch (err) {
    console.log(err);
  }
};

export { getPlatforms };
