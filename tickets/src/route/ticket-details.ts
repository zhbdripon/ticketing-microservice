import express, { Request, Response } from "express";
import { Ticket } from "../../model/ticket";
import { NotFoundError } from "@microservice_demo/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res, next) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    return next(new NotFoundError());
  }

  return res.send(ticket).status(200);
});

export { router as ticketDetailRouter };
