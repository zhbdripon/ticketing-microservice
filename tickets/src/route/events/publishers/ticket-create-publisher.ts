import { Publisher, Subjects, TicketCreatedEvent } from "@microservice_demo/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}