import { Redis } from "ioredis";
import { log } from "./util";

export class MessagePublisher {
    deliveries: Map<string, UserMessageListener[]>;

    constructor(readonly subscriber: Redis, readonly publisher: Redis) {
        this.deliveries = new Map();
    }

    async addListener(roomId: string, listener: UserMessageListener): Promise<boolean> {
        if (!this.deliveries.has(roomId)) {
            log("POPULATE_DELIVERY", { roomId });
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
            log("DELETE_DELIVERY", { roomId });

            this.deliveries.delete(roomId);
            return true;
        }
    }

    publish(event: UserMessage): Promise<void> {
        return this.publisher.publish(`room`, JSON.stringify(event))
            .then(clients => log("DELIVER_MESSAGE", { event, listeners: this.deliveries.size, clients }));
    }

    protected subscribe(): Promise<void> {
        this.subscriber.on("message", this.handleMessage.bind(this));
        return this.subscriber.subscribe("room")
            .then(count => log("SUBSCRIBE_MESSAGES", { count }));
    }

    protected unsubscribe(): Promise<void> {
        this.subscriber.removeListener("message", this.handleMessage.bind(this));
        return this.subscriber.unsubscribe("room")
            .then(count => log("UNSUBSCRIBE_MESSAGES", { count }));
    }

    protected handleMessage(channel: string, message: string): void {
        if (channel !== "room")
            return;

        const event = JSON.parse(message) as UserMessage;
        log("RECEIVE_MESSAGE", { channel, message: event });

        const listeners = this.deliveries.get(event.roomId);
        if (listeners) {
            listeners.forEach(listener => listener(event));
        } else {
            log("NO_DELIVERY_FOUND", { channel, message });
        }
    }

    static start(subscriber: Redis, publisher: Redis): MessagePublisher {
        const emitter = new MessagePublisher(subscriber, publisher);
        emitter.subscribe();
        return emitter;
    }
}

export type UserMessageListener = (event: UserMessage) => void;
