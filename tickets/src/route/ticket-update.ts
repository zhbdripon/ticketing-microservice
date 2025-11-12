import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  ValidationError,
} from "@microservice_demo/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket, ticketUpdateSchema } from "../../model/ticket";

const router = express.Router();

router.put(
  "api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const existingTicket = await Ticket.findById(req.params.id);

    if (!existingTicket) {
      return next(new NotFoundError());
    }

    if (existingTicket.userId !== req.currentUser?.id) {
      return next(new BadRequestError("Invalid User"));
    }

    const parsedPayload = ticketUpdateSchema.safeParse(req.body);

    if (!parsedPayload.success) {
      return next(new ValidationError(parsedPayload.error));
    }

    const { title, price } = parsedPayload.data;

    existingTicket.set({
      title: title,
      price: price,
    });

    await existingTicket.save();

    res.send(existingTicket);
  }
);

export { router as ticketUpdateRouter };
