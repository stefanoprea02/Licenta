import { NextFunction, Request } from "express";
import Game from "./game.entity";
import {
  MessageResponse,
  TypedRequest,
  TypedRequestBody,
  TypedRequestQuery,
  TypedResponse,
  convertToObjectId,
} from "../utils/web";
import { EditDraftDTO, GetGameDTO, UploadDraftDTO } from "./game.types";
import * as fs from "fs";
import * as unzipper from "unzipper";

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

const getGameById = async (
  req: TypedRequestQuery<{ gameId: string }>,
  res: TypedResponse<GetGameDTO | MessageResponse>,
  _next: NextFunction
) => {
  try {
    const game = await Game.findById(req.query.gameId)
      .populate("genres")
      .populate("languages")
      .populate("platforms")
      .populate("tags")
      .populate({
        path: "user",
        select: "-password",
      })
      .exec();

    if (game) return res.status(200).json(game);
    else return res.status(400).json({ message: "Could not find game" });
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
    if (!response.success) {
      await Game.deleteOne({ _id: savedGame._id });
      return res.status(500).json({ message: response.message });
    } else if (response.result) {
      await Game.findOneAndUpdate(
        { _id: savedGame._id },
        { images: response.result },
        {
          new: true,
        }
      );
    }
  } else {
    await Game.deleteOne({ _id: savedGame._id });
    return res.status(400).json({ message: "Bad request" });
  }

  return res.status(200).json({ message: `${savedGame._id}` });
};

const editDraft = async (
  req: TypedRequest<{ id: string }, EditDraftDTO>,
  res: TypedResponse<MessageResponse>,
  _next: NextFunction
) => {
  const user = res.locals.id;
  const { title, description, genres, languages, platforms, tags, oldImages } =
    req.body;

  let savedGame;

  try {
    const draftValues = {
      title,
      description,
      genres: genres.map((genre) => convertToObjectId(genre)),
      languages: languages.map((language) => convertToObjectId(language)),
      platforms: platforms.map((platform) => convertToObjectId(platform)),
      tags: tags.map((tag) => convertToObjectId(tag)),
      user: convertToObjectId(user),
    };

    savedGame = await Game.findOneAndUpdate(draftValues);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  if (!savedGame)
    return res
      .status(400)
      .json({ message: "Could not find game inside database" });

  await handleDeleteFilesNotInArray(oldImages, req.query.id);

  if (Array.isArray(req.files)) {
    const response = await handleImageUpload(
      req.files,
      savedGame._id.toString()
    );
    if (!response.success)
      return res.status(500).json({ message: response.message });
    else if (response.result) {
      await Game.findOneAndUpdate(
        { _id: savedGame._id },
        { images: [...oldImages, ...response.result] },
        {
          new: true,
        }
      );
    }
  }

  return res.status(200).json({ message: `${savedGame._id}` });
};

const uploadGame = async (
  req: TypedRequestQuery<{ gameId: string }>,
  res: TypedResponse<MessageResponse>,
  _next: NextFunction
) => {
  if (req.file) {
    const response = await handleGameUpload(req.file, req.query.gameId);
    if (response.success) {
      try {
        await Game.findOneAndUpdate(
          { _id: req.query.gameId },
          { gameFile: response.result }
        );
        return res.status(200).json({ message: response.message });
      } catch (err) {
        if (response.result) await deleteFile(response.result, "");
        return res.status(400).json({ message: "Something wrong with user" });
      }
    }
    return res.status(400).json({ message: response.message });
  }
  return res.status(400).json({ message: "No game file" });
};

const checkOrCreateDirectory = (path: string): void => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

const constructDestinationPath = (
  folder: string,
  id: string,
  file: Express.Multer.File,
  fileIsFolder?: boolean
): string => {
  const extension = fileIsFolder ? "" : `.${file.mimetype.split("/").pop()}`;
  return `${folder}/${id}/${file.filename}${extension}`;
};

const handleGameUpload = async (
  file: Express.Multer.File,
  id: string
): Promise<{ success: boolean; message: string; result?: string }> => {
  checkOrCreateDirectory(`games/${id}/`);

  if (file.mimetype === "application/x-zip-compressed") {
    const destinationPath = constructDestinationPath("games", id, file, true);

    try {
      await fs
        .createReadStream(file.path)
        .pipe(unzipper.Extract({ path: destinationPath }))
        .promise();

      await deleteFile(file.path, "");

      return { success: true, message: "success", result: destinationPath };
    } catch (err) {
      return await deleteFile(file.path, "Error extracting zip file");
    }
  }

  return await deleteFile(file.path, "Invalid image type");
};

const handleDeleteFilesNotInArray = async (oldImages: string[], id: string) => {
  const folderPath = `images/${id}/`;
  let folderImages;
  try {
    folderImages = await fs.promises.readdir(folderPath);
  } catch (err) {
    console.error(err);
    return;
  }

  const imagesToDelete = folderImages.filter((image) => {
    return !oldImages.includes(folderPath + image);
  });

  if (imagesToDelete.length > 0)
    for (const imageToDelete of imagesToDelete) {
      await deleteFile(
        folderPath + "/" + imageToDelete,
        "Failed to delete image"
      );
    }
};

const handleImageUpload = async (
  files: Express.Multer.File[],
  id: string
): Promise<{
  success: boolean;
  message: string;
  result?: string[];
}> => {
  checkOrCreateDirectory(`images/${id}/`);

  let filePaths: string[] = [];

  for (const file of files) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      const destinationPath = constructDestinationPath("images", id, file);

      filePaths.push(destinationPath);

      try {
        await fs.promises.rename(file.path, destinationPath);
      } catch (error) {
        return await deleteFile(file.path, "Error renaming file");
      }
    } else {
      return await deleteFile(file.path, "Invalid image type");
    }
  }

  return { success: true, message: "success", result: filePaths };
};

const deleteFile = async (
  filePath: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error("Error deleting invalid file:", err);
  }
  return {
    success: false,
    message,
  };
};

export { getGames, uploadGame, uploadDraft, getGameById, editDraft };
