import { Document, Types } from "mongoose";

export interface ITag extends Document {
  tag: string;
  description: string;
}

export interface GetTagDTO extends ITag {
  _id: Types.ObjectId;
}
