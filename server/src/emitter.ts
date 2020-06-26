export class RandomIntEmitter {
    listeners: Set<(value: number) => void>;

    constructor() {
        this.listeners = new Set();
        this.emit();
    }

    addListener(listener: (value: number) => void): boolean {
        if (this.listeners.has(listener)) {
            return false;
        } else {
            this.listeners.add(listener);
            return true;
        }
    }

    removeListener(listener: (value: number) => void): boolean {
        if (this.listeners.has(listener)) {
            this.listeners.delete(listener);
            return true;
        } else {
            return false;
        }
    }

    emit(): void {
        const value = Math.floor(Math.random() * 10000);
        console.log({ event: "EMITTING_VALUE", data: { value, listeners: this.listeners.size } });
        this.listeners.forEach(listener => listener(value));

        const durationMs = Math.random() * 3000 + 100;
        setTimeout(() => this.emit(), durationMs);
    }
}
