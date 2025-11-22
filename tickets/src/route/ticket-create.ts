import { NextFunction, Request, Response, Router } from "express";
import { requireAuth, ValidationError } from "@microservice_demo/common";
import * as z from "zod";
import { Ticket } from "../../model/ticket";
import { TicketCreatedPublisher } from "./events/publishers/ticket-create-publisher";
import { natsWrapper } from "../nats-client";

const router = Router();

const ticketSchema = z.object({
  title: z.string().min(1).max(255),
  price: z.number().gte(0),
});

router.post(
  "/api/tickets",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedTicket = ticketSchema.safeParse(req.body);

    if (!parsedTicket.success) {
      return next(new ValidationError(parsedTicket.error));
    }

    const { title, price } = parsedTicket.data;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser?.id!,
    });

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as ticketCreateRouter };
