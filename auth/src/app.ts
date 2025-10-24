import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError } from "./errors";
import { errorHandler } from "./middleware/errorHandler";
import userRouter from "./route/auth";

const app = express();
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    httpOnly: true,
  })
);
app.use(express.json());

app.use(userRouter);
app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
