import { NextFunction, Request, Response } from "express";
import { KnownError, SerializedErrorResponse } from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof KnownError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Handle other errors
  return res.status(500).send({
    errors: [{ message: "Something went wrong" }] as SerializedErrorResponse[],
  });
};
