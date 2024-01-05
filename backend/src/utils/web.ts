import { CookieOptions } from "express";
import { Query } from "express-serve-static-core";
import mongoose from "mongoose";

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
  file?: Express.Multer.File;
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
  file?: Express.Multer.File;
}

export interface TypedRequest<T extends Query, U> extends Express.Request {
  body: U;
  query: T;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
  file?: Express.Multer.File;
}

export interface MessageResponse {
  message: string;
}

export interface TypedResponse<ResBody> extends Express.Response {
  cookie: (name: string, value: any, options: CookieOptions) => this;
  json: (body: ResBody) => this;
  status: (code: number) => this;
  locals: {
    [key: string]: string;
  };
  clearCookie: (name: string, options?: any) => this;
}
export function parseCookies(cookies: string) {
  return cookies
    .split(";")
    .map((v: string) => v.split("="))
    .reduce((acc: { [key: string]: string }, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

export function convertToObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}
