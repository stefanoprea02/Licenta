import User from "./user.entity";
import { hashSync, compareSync } from "bcryptjs";
import { Request, RequestHandler } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import {
  MessageResponse,
  TypedRequestBody,
  TypedResponse,
  parseCookies,
} from "../utils/web";
import { GetUserDTO, IUser, SigninDTO, SignupDTO } from "./user.types";
import { Document, Types } from "mongoose";

function isJwtPayload(obj: any): obj is JwtPayload {
  return obj && typeof obj === "object" && "id" in obj;
}

const mapUserToGetUserDTO = (
  user: Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    }
): GetUserDTO => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

const getUser = async (res: TypedResponse<GetUserDTO | MessageResponse>) => {
  const userId = res.locals.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    console.log(err);
  }
  if (!user) return res.status(404).json({ message: "User Not Found" });

  return res.status(200).json({ ...user });
};

const signup = async (
  req: TypedRequestBody<SignupDTO>,
  res: TypedResponse<(GetUserDTO & { token: string }) | MessageResponse>
) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = hashSync(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();

    const token = sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    const userDTO = mapUserToGetUserDTO(user);

    return res.status(200).json({ ...userDTO, token });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Could not save user" });
  }
};

const signin = async (
  req: TypedRequestBody<SigninDTO>,
  res: TypedResponse<(GetUserDTO & { token: string }) | MessageResponse>
) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found." });
  }

  const correctPassword = compareSync(password, existingUser.password);

  if (!correctPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = sign({ id: existingUser._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    sameSite: "lax",
  });

  const userDTO = mapUserToGetUserDTO(existingUser);

  return res.status(200).json({ ...userDTO, token });
};

const verifyToken: RequestHandler = (req, res, next) => {
  const cookiesHeader = req.headers.cookie;
  if (!cookiesHeader)
    return res.status(401).json({ message: "No cookies found" });

  const parsedCookies = parseCookies(cookiesHeader);

  const token = parsedCookies.token;

  if (!token) {
    res.status(401).json({ message: "No token found" });
  }

  verify(String(token), process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!isJwtPayload(user)) {
      return res.status(500).json({ message: "Unexpected user data format" });
    }

    const jwtUser = user as JwtPayload;

    res.locals.id = jwtUser.id;
  });

  next();
};

const refreshToken: RequestHandler = (req, res, next) => {
  const cookiesHeader = req.headers.cookie;
  if (!cookiesHeader)
    return res.status(401).json({ message: "No cookies found" });

  const parsedCookies = parseCookies(cookiesHeader);

  const prevToken = parsedCookies.token;

  if (!prevToken)
    return res.status(400).json({ message: "Couldn't find token" });

  verify(String(prevToken), process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    if (!isJwtPayload(user)) {
      return res.status(500).json({ message: "Unexpected user data format" });
    }

    const jwtUser = user as JwtPayload;

    res.clearCookie(`${jwtUser.id}`);

    const token = sign({ id: jwtUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie(String(jwtUser.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    res.locals.id = jwtUser.id;
    next();
  });
};

const logout = (req: Request, res: TypedResponse<MessageResponse>) => {
  const cookies = req.headers.cookie;
  if (!cookies) return res.status(404).json({ message: "No cookies found" });

  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  verify(String(prevToken), process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    if (!isJwtPayload(user)) {
      return res.status(500).json({ message: "Unexpected user data format" });
    }

    const jwtUser = user as JwtPayload;

    res.clearCookie(`${jwtUser.id}`);

    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

export { logout, signup, signin, verifyToken, getUser, refreshToken };
