import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
});

export default mongoose.model("Language", languageSchema);
