import cookieSession from "cookie-session";
import express from "express";

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@microservice_demo/common";
import { ticketCreateRouter } from "./route/ticket-create";
import { ticketDetailRouter } from "./route/ticket-details";
import { ticketListRouter } from "./route/ticket-list";
import { ticketUpdateRouter } from "./route/ticket-update";

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

app.use(currentUser);
app.use(ticketCreateRouter);
app.use(ticketDetailRouter);
app.use(ticketListRouter);
app.use(ticketUpdateRouter);

app.use((req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
