import { Publisher, Subjects, TicketUpdatedEvent } from "@microservice_demo/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}