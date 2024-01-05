import mongoose from "mongoose";
import { ILanguage } from "./language.types";

const languageSchema = new mongoose.Schema<ILanguage>({
  language: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
});

export default mongoose.model("Language", languageSchema);
