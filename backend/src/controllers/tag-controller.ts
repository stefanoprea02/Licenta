import { RequestHandler } from "express";

import Tag from "../models/Tag";

const getTags: RequestHandler = async (req, res, next) => {
  try {
    const allTags = await Tag.find({}, "tag");

    return res.status(200).json({ tags: allTags });
  } catch (err) {
    console.log(err);
  }
};

export { getTags };
