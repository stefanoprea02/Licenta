import mongoose from "mongoose";
import { IUser } from "./user.types";

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
