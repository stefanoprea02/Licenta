import { Document, Types } from "mongoose";

export interface IPlatform extends Document {
  platform: string;
  description: string;
}

export interface GetPlatformDTO extends IPlatform {
  _id: Types.ObjectId;
}
