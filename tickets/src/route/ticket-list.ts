import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../../model/ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find({});

    return res.send(tickets);
  }
);

export { router as ticketListRouter };
