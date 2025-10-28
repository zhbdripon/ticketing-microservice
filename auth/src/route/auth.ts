import {
  authReqValidation,
  BadRequestError,
  currentUser,
} from "@microservice_demo/common";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { Password } from "../services/password";

interface UserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const router = express.Router();

router.get(
  "/api/users/current-user",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

router.post(
  "/api/users/sign-in",
  authReqValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const jwToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: jwToken,
    };

    res.status(200).send(user);
  }
);

router.post("/api/users/sign-out", (req: Request, res: Response) => {
  req.session = undefined;
  res.status(204).send({});
});

router.post(
  "/api/users/sign-up",
  authReqValidation,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError("Email in use"));
    }

    const user = User.build({ email, password });
    await user.save();
    const jwToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: jwToken,
    };

    res.status(201).send(user);
  }
);

export default router;
