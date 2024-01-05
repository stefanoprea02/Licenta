import { Document, Types } from "mongoose";

export interface IGenre extends Document {
  genre: string;
  description: string;
}

export interface GetGenreDTO extends IGenre {
  _id: Types.ObjectId;
}
