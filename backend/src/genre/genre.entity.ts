import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
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
