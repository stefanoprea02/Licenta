import mongoose from "mongoose";
import { ITag } from "./tag.types";

const tagSchema = new mongoose.Schema<ITag>({
  tag: {
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

export default mongoose.model("Tag", tagSchema);
