const express = require("express");
const {
  signup,
  signin,
  verifyToken,
  getUser,
  refreshToken,
  logout,
} = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;
