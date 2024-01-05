import mongoose from "mongoose";
import { IGenre } from "./genre.types";

const genreSchema = new mongoose.Schema<IGenre>({
  genre: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
  description: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 200,
  },
});

export default mongoose.model("Genre", genreSchema);
