import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
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
