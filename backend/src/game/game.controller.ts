import { NextFunction, Request, RequestHandler } from "express";
import Game from "./game.entity";
import {
  MessageResponse,
  TypedRequestBody,
  TypedResponse,
  convertToObjectId,
} from "../utils/web";
import { GetGameDTO, UploadDraftDTO } from "./game.types";
import * as fs from "fs";

const getGames = async (
  _req: Request,
  res: TypedResponse<GetGameDTO[]>,
  _next: NextFunction
) => {
  try {
    const allGames = await Game.find({})
      .populate("genres")
      .populate("languages")
      .populate("platforms")
      .populate("tags")
      .populate({
        path: "user",
        select: "-password",
      })
      .exec();

    return res.status(200).json([...allGames]);
  } catch (err) {
    console.log(err);
  }
};

const uploadDraft = async (
  req: TypedRequestBody<UploadDraftDTO>,
  res: TypedResponse<MessageResponse>,
  _next: NextFunction
) => {
  const user = res.locals.id;
  const { title, description, genres, languages, platforms, tags } = req.body;

  let savedGame;

  try {
    const draftValues = {
      title,
      description,
      status: "draft",
      genres: genres.map((genre) => convertToObjectId(genre)),
      languages: languages.map((language) => convertToObjectId(language)),
      platforms: platforms.map((platform) => convertToObjectId(platform)),
      tags: tags.map((tag) => convertToObjectId(tag)),
      user: convertToObjectId(user),
    };

    const game = new Game(draftValues);

    savedGame = await game.save();
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  if (Array.isArray(req.files)) {
    const response = await handleImageUpload(
      req.files,
      savedGame._id.toString()
    );
    if (response.succes) {
      await Game.findOneAndUpdate(
        { _id: savedGame._id },
        { images: response.result },
        {
          new: true,
        }
      );
    } else {
      await Game.deleteOne({ _id: savedGame._id });
      return res.status(400).json({ message: response.message });
    }
  } else {
    await Game.deleteOne({ _id: savedGame._id });
    return res.status(400).json({ message: "Bad request" });
  }

  return res.status(200).json({ message: `${savedGame._id}` });
};

const uploadGame: RequestHandler = async (_req, res, _next) => {
  return res.status(200);
};

const handleImageUpload = async (
  files: Express.Multer.File[],
  id: string
): Promise<{ succes: boolean; message: string; result: string[] }> => {
  let filePaths: string[] = [];

  if (!fs.existsSync(`images/${id}/`)) {
    fs.mkdirSync(`images/${id}/`, { recursive: true });
  }

  for (const file of files) {
    const type = file.mimetype;

    if (
      type &&
      (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    ) {
      const destinationPath =
        `images/${id}/` + file.filename + `.${file.mimetype.split("/").pop()}`;

      filePaths.push(destinationPath);

      await fs.promises.rename(file.path, destinationPath);
    } else {
      console.error("Invalid image type:", file.originalname);
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting invalid file:", err);
        } else {
          console.log("Invalid file deleted successfully!");
        }
      });
      return {
        succes: false,
        message: `Invalid image type:, ${file.originalname}`,
        result: [""],
      };
    }
  }

  return { succes: true, message: "success", result: filePaths };
};

export { getGames, uploadGame, uploadDraft };
