import mongoose from "mongoose";

const platformSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
});

export default mongoose.model("Platform", platformSchema);
