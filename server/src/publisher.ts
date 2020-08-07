import { Redis } from "ioredis";

export class MessagePublisher {
    deliveries: Map<string, UserMessageListener[]>;

    constructor(readonly subscriber: Redis, readonly publisher: Redis) {
        this.deliveries = new Map();
    }

    async addListener(roomId: string, listener: UserMessageListener): Promise<boolean> {
        if (!this.deliveries.has(roomId)) {
            console.log({ event: "POPULATE_DELIVERY", data: { roomId } })
            this.deliveries.set(roomId, []);
        }

        const listeners = this.deliveries.get(roomId)!;
        this.deliveries.set(roomId, listeners.concat([listener]));

        return true;
    }

    removeListener(roomId: string, removal: UserMessageListener): boolean {
        const listeners = this.deliveries.get(roomId);
        if (!listeners)
            return false;

        const edited = listeners.filter(listener => listener !== removal);

        if (edited.length > 0) {
            this.deliveries.set(roomId, edited);
            return true;
        } else {
            console.log({ event: "DELETE_DELIVERY", data: { roomId } })
            this.deliveries.delete(roomId);
            return true;
        }
    }

    publish(event: UserMessage): Promise<void> {
        return this.publisher.publish(`room`, JSON.stringify(event))
            .then(clients => console.log({ event: "PUBLISH_MESSAGE", data: { event, listeners: this.deliveries.size, clients } }))
    }

    protected subscribe(): Promise<void> {
        this.subscriber.on("message", this.handleMessage.bind(this));
        return this.subscriber.subscribe("room")
            .then(count => console.log({ event: "SUBSCRIBE_MESSAGES", data: { count } }));
    }

    protected unsubscribe(): Promise<void> {
        this.subscriber.removeListener("message", this.handleMessage.bind(this));
        return this.subscriber.unsubscribe("room")
            .then(count => console.log({ event: "UNSUBSCRIBE_MESSAGES", data: { count } }));
    }

    protected handleMessage(channel: string, message: string): void {
        if (channel !== "room")
            return;

        const event = JSON.parse(message) as UserMessage;
        console.log({ event: "RECEIVE_MESSAGE", data: { channel, message: event } });

        const listeners = this.deliveries.get(event.roomId);
        if (listeners) {
            listeners.forEach(listener => listener(event));
        } else {
            console.error({ event: "NO_DELIVERY_FOUND", data: { channel, message } });
        }
    }

    static start(subscriber: Redis, publisher: Redis): MessagePublisher {
        const emitter = new MessagePublisher(subscriber, publisher);
        emitter.subscribe();
        return emitter;
    }
}

export type UserMessageListener = (event: UserMessage) => void;
