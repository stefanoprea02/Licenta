import mongoose from "mongoose";
import { IPlatform } from "./platform.types";

const platformSchema = new mongoose.Schema<IPlatform>({
  platform: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
});

export default mongoose.model("Platform", platformSchema);
