import { Document, Types } from "mongoose";

export interface IGame extends Document {
  title: string;
  description: string;
  status: string;
  images?: string[];
  gameFile?: string;
  genres: Types.ObjectId[];
  languages: Types.ObjectId[];
  platforms: Types.ObjectId[];
  tags: Types.ObjectId[];
  user: Types.ObjectId;
}

export interface UploadDraftDTO {
  title: string;
  description: string;
  genres: string[];
  languages: string[];
  platforms: string[];
  tags: string[];
}

export interface EditDraftDTO extends UploadDraftDTO {
  oldImages: string[];
}

export interface GetGameDTO extends IGame {
  _id: Types.ObjectId;
}
