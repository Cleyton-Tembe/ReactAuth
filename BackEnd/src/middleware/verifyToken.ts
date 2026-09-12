import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.ts";

export default async function protectToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("req: ", req.cookies);
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(400).json({ message: "No cookie provided" });
    }

    const decode: JwtPayload | string = jwt.verify(
      token,
      process.env.TOKEN_SECRET!,
    );

    if (!decode) {
      return res.status(401).json({ message: "Not authorized token" });
    }

    const dbUser = await User.findOne({ _id: decode.id });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = dbUser;

    return res.status(200).json({ userid: decode, userFound: dbUser });
  } catch (error) {
    console.log("protectToken middleware: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
