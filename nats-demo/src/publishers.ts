import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-create-publisher';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS')

    const publisher = new TicketCreatedPublisher(stan);
    publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    }).then(() => {
        console.log('Event published via Publisher class');
    }).catch((err) => {
        console.error('Error publishing event:', err);
    });
})

 