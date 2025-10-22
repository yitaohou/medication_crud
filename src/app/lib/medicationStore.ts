import { MedicationInput, Medication } from "../types";
import { calculateRefillDate } from "../utils";

class MedicationStore {
    private medications: Medication[] = [];
    private nextId: number = 1;

    getAll(): Medication[] {
        return this.medications;
    }

    getById(id: number): Medication | undefined {
        return this.medications.find(m => m.id === id);
    }

    add(medicationInput: MedicationInput): Medication {
        const refillDate = calculateRefillDate(medicationInput.startDate, medicationInput.dosageMissed, medicationInput.dosageTotal, medicationInput.frequency.times, medicationInput.frequency.per);
        const newMedication: Medication = {
            ...medicationInput,
            id: this.nextId++,
            createdAt: new Date().toISOString(),
            refillDate: refillDate.toISOString(),
        };
        this.medications.push(newMedication);
        return newMedication;
    }

    update(id: number, updates: Partial<MedicationInput>): Medication | null {
        const index = this.medications.findIndex(m => m.id === id);
        if (index === -1) return null;

        const currentMedication = this.medications[index];
        const startDate = updates.startDate || currentMedication.startDate;
        const dosageMissed = updates.dosageMissed || currentMedication.dosageMissed;
        const dosageTotal = updates.dosageTotal || currentMedication.dosageTotal;
        const frequency = updates.frequency || currentMedication.frequency;

        const refillDate = calculateRefillDate(startDate, dosageMissed, dosageTotal, frequency.times, frequency.per);
        this.medications[index] = {
            ...this.medications[index],
            ...updates,
            refillDate: refillDate.toISOString(),
        };
        return this.medications[index];
    }

    delete(id: number): boolean {
        const index = this.medications.findIndex(m => m.id === id);
        if (index === -1) return false;

        this.medications.splice(index, 1);
        return true;
    }

    getExpiringSoon(days: number = 7): Medication[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);

        return this.medications
            .filter(med => {
                const refillDate = new Date(med.refillDate);
                refillDate.setHours(0, 0, 0, 0);
                return refillDate >= today && refillDate <= futureDate && med.dosageRemaining > 0;
            })
            .sort((a, b) => {
                return new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime();
            });
    }

    getExpired(): Medication[] {
        return this.medications
            .filter(med => {
                return med.dosageRemaining <= 0;
            })
            .sort((a, b) => {
                return new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime();
            });
    }

    clear(): void { 
        this.medications = [];
        this.nextId = 1;
    }

    restore(medication: Medication): void {
        this.medications.push(medication);

        if (medication.id >= this.nextId) {
            this.nextId = medication.id + 1;
        }
    }
}


export const medicationStore = new MedicationStore();