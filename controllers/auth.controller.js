const _ = require("lodash");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ApiError = require("../ApiError");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ $or: [{ name }, { email }] }).lean();
    if (user) {
      console.log({ name });
      throw new ApiError({
        message: "User with email or name exists",
        status: 404,
      });
    }
    const hashPass = await bcrypt.hash(password, 12);
    const insertUser = await User.create({
      name,
      email,
      password: hashPass,
      role,
    });
    console.log({ insertUser });
    return res.status(200).json({ status: "user added success" });
  } catch (er) {
    return next(er);
  }
};

const login = async (req, res, next) => {
  console.log("log here");
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name }).lean();
    if (!user) {
      console.log("here?");
      throw new ApiError({ message: "user does not exist", status: 404 });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError({ message: "password not match", status: 500 });
    }
    const tokenPayload = {
      role: user.role,
      name: user.name,
      email: user.email,
    };
    let token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "2 days",
    });

    let result = {
      ...tokenPayload,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({ ...result, message: "logged in" });
  } catch (er) {
    return next(er);
  }
};

const checkLogin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new ApiError({ status: 403, message: "invalid token" }));
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    console.log("verifying");
    if (err)
      return next(new ApiError({ status: 403, message: "invalid token" })); //invalid token
    console.log(decoded); //for correct token
    const { name } = decoded;
    const user = await User.findOne({ name }).lean();
    if(!user){
        next(new ApiError({ status: 403, message: "no user" }))
    }
    req.user = { ...user };
    next();
  });
};

module.exports = {
  login,
  signup,
  checkLogin,
};
