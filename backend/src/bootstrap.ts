import mongoose from "mongoose";
import fs from "fs/promises";
import Genre from "./genre/genre.entity";
import Tag from "./tag/tag.entity";
import Platform from "./platform/platform.entity";
import Language from "./language/language.entity";

const readJSON = async (filePath: string) => {
  try {
    const jsonData = await fs.readFile(filePath);
    const jsonDataString = jsonData.toString("utf-8");
    return JSON.parse(jsonDataString);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const documentExists = async (document: string) => {
  switch (document) {
    case "genres":
      try {
        const count = await Genre.countDocuments();
        return count > 0;
      } catch (error) {
        console.error("Error checking if genres exist:", error);
        throw error;
      }
    case "tags":
      try {
        const count = await Tag.countDocuments();
        return count > 0;
      } catch (error) {
        console.error("Error checking if tags exist:", error);
        throw error;
      }
    case "platforms":
      try {
        const count = await Platform.countDocuments();
        return count > 0;
      } catch (error) {
        console.error("Error checking if platforms exist:", error);
        throw error;
      }
    case "languages":
      try {
        const count = await Language.countDocuments();
        return count > 0;
      } catch (error) {
        console.error("Error checking if languages exist:", error);
        throw error;
      }
    default:
      break;
  }
};

export default async function Bootstrap() {
  mongoose
    .connect("mongodb://localhost/docker-db")
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => console.log(err));

  const dbDataSet = ["genres", "tags", "platforms", "languages"];

  //TODO: fix documentName validation failed

  for (const documentName of dbDataSet) {
    const docAlreadyExists = await documentExists(documentName);

    if (!docAlreadyExists) {
      const docData = await readJSON(`./data/${documentName}.json`);

      for (const docEntry of docData) {
        try {
          switch (documentName) {
            case "genres":
              const genre = new Genre(docEntry);
              await genre.save();
            case "tags":
              const tag = new Tag(docEntry);
              await tag.save();
            case "platforms":
              const platform = new Platform(docEntry);
              await platform.save();
            case "languages":
              const language = new Language(docEntry);
              await language.save();
            default:
              break;
          }
        } catch (err) {
          console.log(err);
        }
      }

      console.log(`Inserted ${documentName} inside the db`);
    }
  }
}
