import type { Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export default function createToken(
  id: string,
  res: Response,
): string | JwtPayload {
  try {
    if (!id) {
      return res.status(400).json({ message: "no param provided" });
    }

    const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    console.log("creating token: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
}
