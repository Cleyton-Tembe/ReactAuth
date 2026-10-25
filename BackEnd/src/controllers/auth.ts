import type { Request, Response } from "express";
import User from "../models/user.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import generateVerificationCode from "../helpers/generateVerificationCode.ts";
import createToken from "../helpers/createToken.ts";
import {
  sendPasswordResetEmail,
  sendSuccessResetEmail,
  sendVerificationEmail,
  welcomeEmail,
} from "./mail.ts";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    console.log("password", password);
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: "all fields must be filled", success: false });
    }

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const verificationToken = generateVerificationCode();

    const newUser = new User({
      name,
      email,
      password: hashed,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();
    createToken(newUser._id.toString(), res);
    await sendVerificationEmail(newUser.email, verificationToken);
    return res.status(201).json({
      message: "user created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("signUP: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "no verification code Provided", success: false });
    }

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "something went wrong", success: false });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await welcomeEmail(user.name, user.email);
    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.log("verifyEmail:", error);
    return res.status(500).json({ message: "something went wrong!" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }

    const dbUser = await User.findOne({ email: email });

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    const isCorrect = await bcrypt.compare(password, dbUser?.password);

    if (!isCorrect) {
      return res.status(400).json({
        message: "boss nao mudamos as credenciais semana passada ?",
        success: false,
      });
    }

    createToken(dbUser._id.toString(), res);
    dbUser.lastLogin = new Date();
    await dbUser.save();

    return res.status(200).json({
      message: "User successfully logged",
      success: true,
      user: dbUser,
    });
  } catch (error) {
    console.log("login function: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (req.cookies) {
      const reqCookie = req.cookies.authToken;
      if (!reqCookie) {
        return res
          .status(404)
          .json({ message: "no token found", success: false });
      }

      const authToken = jwt.verify(reqCookie, process.env.TOKEN_SECRET!);

      if (!authToken) {
        return res
          .status(401)
          .json({ message: "Not authorized", success: false });
      }

      res.clearCookie("authToken");
      return res
        .status(200)
        .json({ message: "logout successfully!", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "No token provided!", success: false });
    }
  } catch (error) {
    console.log("logout function: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExperiration = new Date();
    resetTokenExperiration.setTime(
      resetTokenExperiration.getTime() + 60 * 60 * 1000,
    );
    dbUser.resetPasswordToken = resetToken;
    dbUser.resetPasswordExperiresAt = resetTokenExperiration;

    await dbUser.save();

    await sendPasswordResetEmail(
      dbUser.email,
      process.env.RESET_PWD_URL! + "/" + resetToken,
    );

    return res
      .status(200)
      .json({ message: "email sent successfully", success: true });
  } catch (error) {
    console.log("forgotPassword fun: ", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    const dbUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExperiresAt: { $gt: Date.now() },
    });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    dbUser.password = hashed;
    dbUser.resetPasswordExperiresAt = undefined;
    dbUser.resetPasswordToken = undefined;
    await dbUser.save();
    await sendSuccessResetEmail(dbUser.email);

    return res
      .status(200)
      .json({ message: "Password Reseted Successfully!", succees: true });
  } catch (error) {
    console.log("resetPassword fun: ", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
