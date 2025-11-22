import { Message } from "node-nats-streaming";
import { Listener } from "./base-listeners";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-create-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "order-service-queue-group";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Processing ticket created event:", data);
    msg.ack();
  }
} 