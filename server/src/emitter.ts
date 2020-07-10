export class MessageEmitter {
    listeners: Set<UserMessageListener>;

    constructor() {
        this.listeners = new Set();
    }

    addListener(listener: UserMessageListener): boolean {
        if (this.listeners.has(listener)) {
            return false;
        } else {
            this.listeners.add(listener);
            return true;
        }
    }

    removeListener(listener: UserMessageListener): boolean {
        if (this.listeners.has(listener)) {
            this.listeners.delete(listener);
            return true;
        } else {
            return false;
        }
    }

    emit(event: UserMessage): void {
        console.log({ event: "EMITTING_VALUE", data: { event, listeners: this.listeners.size } });
        this.listeners.forEach(listener => listener(event));
    }
}

export type UserMessageListener = (event: UserMessage) => void;
