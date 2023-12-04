const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
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

  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie(String(user._id), token, {
    path: "/",
    expiresIn: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json({ user: user, token });
};

const signin = async (req, res, next) => {
  const { username, password } = req.body;

  console.log(req.body);

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found." });
  }

  const correctPassword = bcrypt.compareSync(password, existingUser.password);

  if (!correctPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expiresIn: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({ user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];

  if (!token) {
    res.status(404).json({ message: "No token found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.id = user.id;
  });

  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ messsage: "User Not Found" });
  }
  return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    res.clearCookie(`${user.id}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    res.clearCookie(`${user.id}`);

    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

exports.logout = logout;
exports.signup = signup;
exports.signin = signin;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
