import { Request, Response, NextFunction } from "express";

type CORS = (options?: {
  allowOrigins: string[];
}) => (req: Request, res: Response, next: NextFunction) => void;

const cors: CORS = (options) => (req, res, next) => {
  let { allowOrigins = [] } = options || {};

  let origin = req.headers.origin;
  let method = req.method;

  if (origin && allowOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", method);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  return next();
};

export default cors;