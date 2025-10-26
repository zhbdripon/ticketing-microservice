import express from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { authReqValidation } from "../middleware/authReqValidation";
import { currentUser } from "../middleware/currentUser";
import { User } from "../model/user";
import { Password } from "../services/password";

const router = express.Router();

router.get("/api/users/check", (req, res) => {
  res.send({ status: "ok" });
});

router.get("/api/users/current-user", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post("/api/users/sign-in", authReqValidation, async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordMatch = await Password.compare(user.password, password);
  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials");
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
