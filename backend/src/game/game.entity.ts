import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  status: {
    type: String,
    required: true,
    default: "draft",
  },
  images: {
    type: [String],
  },
  gameFile: {
    type: String,
  },
  genres: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  languages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
  },
  platforms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
  },
  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Game", gameSchema);
