import { Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface SignupDTO extends IUser {}

export interface SigninDTO extends Omit<IUser, "email"> {}

export interface GetUserDTO extends Omit<IUser, "password"> {
  _id: Types.ObjectId;
}
