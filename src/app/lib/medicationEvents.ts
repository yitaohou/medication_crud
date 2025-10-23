type Listener = () => void;

class MedicationEvents {
    private listeners: Listener[] = [];

    subscribe(listener: Listener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emit(): void {
        this.listeners.forEach(listener => listener());
    }
}

export const medicationEvents = new MedicationEvents();