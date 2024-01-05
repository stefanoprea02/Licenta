import { RequestHandler } from "express";

import Platform from "./platform.entity";

const getPlatforms: RequestHandler = async (req, res, next) => {
  try {
    const allPlatforms = await Platform.find({}, "platform");

    return res.status(200).json({ platforms: allPlatforms });
  } catch (err) {
    console.log(err);
  }
};

export { getPlatforms };
