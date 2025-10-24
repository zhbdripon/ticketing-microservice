import express from "express";
import { z } from "zod";
import { BadRequestError, ValidationError } from "./errors";
import { User } from "./model/user";
import jwt from "jsonwebtoken";
import { Password } from "./services/password";
import { authReqValidation } from "./middleware/authReqValidation";
import { currentUser } from "./middleware/currentUser";

const router = express.Router();

router.get("/api/users/current-user", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post("/api/users/sign-in", authReqValidation, (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    Password.compare(user.password, password).then((passwordMatch) => {
      if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials");
      }
    });

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
  });
});

router.post("/api/users/sign-out", (req, res) => {
  req.session = null;
  res.status(204).send({});
});

router.post("/api/users/sign-up", authReqValidation, async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email in use");
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
});

export default router;
