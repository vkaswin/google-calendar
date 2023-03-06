import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

type User = {
  _id: string;
  name: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req?.headers?.authorization?.split(`"`)[1];
    if (!token) return res.status(401).send({ message: "Unauthorized" });
    let decoded = await verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as User;
    next();
  } catch (error: any) {
    console.log("🚀 ~ file: verifyToken.ts:26 ~ verifyToken ~ error:", error);
    if (error.message === "jwt expired")
      res.status(401).send({ message: "Unauthorized" });

    res
      .status(error.message ? 400 : 500)
      .send({ message: error.message || "Error" });
  }
};

export default verifyToken;
