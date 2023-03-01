import { Request, Response, NextFunction } from "express";

type CORS = (options?: {
  allowedOrigins?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => void;

const cors: CORS = (options) => (req, res, next) => {
  let { allowedOrigins, allowedHeaders, credentials } = options || {};

  let origin = req.headers.origin;
  let method = req.method;
  console.log(origin, method);

  if (origin && allowedOrigins && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", method);
    allowedHeaders &&
      res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    credentials && res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
};

export default cors;
