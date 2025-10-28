import cookieSession from "cookie-session";
import express from "express";

import { errorHandler, NotFoundError } from "@microservice_demo/common";
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
app.use((req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
