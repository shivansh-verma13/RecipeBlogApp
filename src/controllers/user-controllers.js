import { UserModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token-manager.js";

export const userSignUp = async (req, res) => {
  try {
    const { userName, password, name, tagline } = req.body;
    const existingUser = await UserModel.findOne({ userName: userName });
    if (existingUser)
      return res.status(401).json({ message: "User ALreadcy Exists!" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      userName: userName,
      password: hashedPassword,
      name: name,
      tagline: tagline,
    });
    await newUser.save();

    res.clearCookie("auth_token", {
      path: "/",
      domain: "recipe-blog-front-end-delta.vercel.app",
      httpOnly: false,
      signed: true,
      secure: true, // Ensure cookie is sent over HTTPS only
      sameSite: "none", // Improve CSRF protection
    });

    const token = createToken(newUser.id.toString(), "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie("auth_token", token, {
      path: "/",
      domain: "recipe-blog-front-end-delta.vercel.app",
      httpOnly: false,
      signed: true,
      expires,
      secure: true, // Ensure cookie is sent over HTTPS only
      sameSite: "none", // Improve CSRF protection
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      userID: newUser.id.toString(),
      name: newUser.name,
      tagline: newUser.tagline,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "User Registration Failed", cause: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await UserModel.findOne({ userName });
    if (!user) return res.status(401).json({ message: "User Does Not Exits" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(403).json({ message: "Password Is Incorrect" });

    res.clearCookie("auth_token", {
      path: "/",
      domain: "recipe-blog-front-end-delta.vercel.app",
      httpOnly: false,
      signed: true,
      secure: true, // Ensure cookie is sent over HTTPS only
      sameSite: "none", // Improve CSRF protection
    });

    const token = createToken(user.id.toString(), "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie("auth_token", token, {
      path: "/",
      domain: "recipe-blog-front-end-delta.vercel.app",
      signed: true,
      httpOnly: false,
      expires,
      secure: true, // Ensure cookie is sent over HTTPS only
      sameSite: "none", // Improve CSRF protection
    });

    return res.status(200).json({
      message: "User Loggen In",
      userID: user.id.toString(),
      name: user.name,
      tagline: user.tagline,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "User Logging In Failed", cause: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id != res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    return res.status(200).json({
      message: "Verified",
      userID: user.id.toString(),
      name: user.name,
      tagline: user.tagline,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Dooes Not Exists or Token Malfucntioned" });
    }
    if (user._id != res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }

    res.clearCookie("auth_token", {
      path: "/",
      domain: "recipe-blog-front-end-delta.vercel.app",
      httpOnly: false,
      signed: true,
      secure: true, // Ensure cookie is sent over HTTPS only
      sameSite: "none", // Improve CSRF protection
    });

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
