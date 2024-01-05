import { Document, Types } from "mongoose";

export interface ILanguage extends Document {
  language: string;
  description: string;
}

export interface GetLanguageDTO extends ILanguage {
  _id: Types.ObjectId;
}
