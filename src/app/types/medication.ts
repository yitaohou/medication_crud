export type Frequency = {
    times: number;
    per: number; // per day
}

export enum RefillStatus {
    EXPIRED = 'expired',
    ENDING_SOON = 'ending-soon',
    NORMAL = 'normal'
}

export enum ActionType {
    TAKE = 'take',
    MISS = 'miss'
}

export enum ModalMode {
    ADD = 'add',
    EDIT = 'edit'
}

export type Medication = {
    id: number;
    name: string;
    dnc?: string; // rxnorm id
    frequency: Frequency;
    dosageTotal: number;
    dosageRemaining: number;
    dosageMissed: number;
    refillDate: string;
    startDate: string;
    createdAt: string;
    note?: string;
};

export type MedicationInput = Omit<Medication, 'id' | 'createdAt' | 'refillDate'>;