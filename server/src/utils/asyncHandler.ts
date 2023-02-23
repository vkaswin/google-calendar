import { Response, Request, NextFunction } from "express";

class CustomError extends Error {
  status!: number;

  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = <T>(
  cb: (req: Request, res: Response, next: NextFunction) => T
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ message: error?.message || "Internal Server Error" });
      console.log("🚀 ~ file: asyncHandler.ts:19 ~ error:", error);
    }
  };
};

export { asyncHandler, CustomError };
