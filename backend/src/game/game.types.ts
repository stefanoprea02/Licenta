import { Document, Types } from "mongoose";

export interface IGame extends Document {
  title: string;
  description: string;
  status: string;
  images?: string[];
  gameFile?: string;
  genres?: Types.ObjectId | string;
  languages?: Types.ObjectId | string;
  platforms?: Types.ObjectId | string;
  tags?: Types.ObjectId | string;
  user?: Types.ObjectId | string;
}

export interface GetGameDTO extends IGame {
  _id: Types.ObjectId;
}
