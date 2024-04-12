import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export function CreateAccesToken(payload) {
  if (!TOKEN_SECRET) {
    console.error("TOKEN_SECRET is not defined.");
    process.exit(1);
  }
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
