import { Frequency, Medication, RefillStatus } from "@/app/types";
import { DEFAULT_EXPIRING_DAYS, MILLISECONDS_PER_DAY } from "@/app/const";


// format frequency to string
export const formatFrequency = (freq: Frequency): string => {
    if (freq.per === 1) {
        return `${freq.times} time${freq.times > 1 ? 's' : ''} per day`;
    } else {
        return `${freq.times} time${freq.times > 1 ? 's' : ''} per ${freq.per} days`;
    }
}

// calculate the remaining days based on the dosage remaining and frequency
export const calculateRemainingDays = (dosageRemaining: number, frequency: Frequency): number => {
    const dosesPerDay = frequency.times / frequency.per;
    const daysRemaining = dosageRemaining / dosesPerDay;

    return daysRemaining;
}

export const calculateRefillDate = (
    startDate: string, 
    dosageMissed: number,
    dosageTotal: number,
    frequencyTimes: number,
    frequencyPer: number
): Date => {

    const start = formatDate(startDate);
    const dosesPerDay = frequencyTimes / frequencyPer;
    const totalDays = dosageTotal / dosesPerDay;
    const totalMissedDays = dosageMissed / dosesPerDay;  
    start.setHours(0, 0, 0, 0);
    const RefillDate = new Date(start);
    RefillDate.setDate(RefillDate.getDate() + Math.ceil(totalDays + totalMissedDays)-1);

    return RefillDate;
}

// string to date
export const formatDate = (date: string): Date => {
    if (date.includes('T')) {
        const isoDate = new Date(date);
        return new Date(isoDate.getFullYear(), isoDate.getMonth(), isoDate.getDate());
    }
    
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
}               

// calculate the remaining dosage based on the start date, total and missed dosage
// Here we enforce that the user either take or miss for the given schedule.
// e.g. they cant take more than expected dosage, or miss more than expected dosage
// we assume that the user take medication on the first date if they have schedule like 1 time per 3 days
export const calculateDosageRemaining = (
    startDate: string,
    frequencyPer: number,
    frequencyTimes: number,
    dosageTotal: number,
    dosageMissed: number
): number => {
    const start = formatDate(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    if (start >= today) {
        return dosageTotal;
    }

    const daysPassed = Math.floor((today.getTime() - start.getTime()) / MILLISECONDS_PER_DAY);
    const dosesPerDay = frequencyTimes / frequencyPer;
    const expectedDosage = Math.ceil(daysPassed * dosesPerDay);

    return Math.max(dosageTotal - expectedDosage + dosageMissed, 0);
}

// function to calculate the max dosage allowance amount for the actions.
// e.g. the max allowance to take or miss for the given schedule.
// start from the start date till the day before today
// we assume that the user take medication on the first date if they have schedule like 1 time per 3 days
export const calculateMaxAllowance = (
    startDate: string,
    frequencyPer: number,
    frequencyTimes: number,
): number => {
    const start = formatDate(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    if (start > today) {
        return 0;
    }       

    const daysPassed = Math.floor((today.getTime() - start.getTime()) / MILLISECONDS_PER_DAY);
    const dosesPerDay = frequencyTimes / frequencyPer;
    const expectedDosage = Math.ceil(daysPassed * dosesPerDay);

    return expectedDosage;
}

export const getRefillStatus = (
    refillDate: Date,
    remainingDosage: number,
): RefillStatus => {
    if (remainingDosage === 0) {
        return RefillStatus.EXPIRED;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    refillDate.setHours(0, 0, 0, 0);

    const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / MILLISECONDS_PER_DAY);

    if (daysUntilRefill < 0) {
        return RefillStatus.EXPIRED;
    } else if (daysUntilRefill <= DEFAULT_EXPIRING_DAYS) {
        return RefillStatus.ENDING_SOON;
    } else {
        return RefillStatus.NORMAL;
    }
};

export function formatMedicationsForExport(medications: Medication[]): string[][] {
    return medications
        .sort((a, b) => {
            const dateDiff = new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime();
            return dateDiff !== 0 ? dateDiff : a.dosageRemaining - b.dosageRemaining;
        })
        .map((med) => {
            const refillDate = new Date(med.refillDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            refillDate.setHours(0, 0, 0, 0);
            
            const daysUntil = Math.floor((refillDate.getTime() - today.getTime()) / MILLISECONDS_PER_DAY);
            const status = getRefillStatus(new Date(med.refillDate), med.dosageRemaining);
            const statusDisplay = status === RefillStatus.EXPIRED ? 'Expired' : status === RefillStatus.ENDING_SOON ? 'Soon' : 'Normal';
            
            return [
                med.name,
                `${med.dosageRemaining}`,
                `${med.frequency.times}x per ${med.frequency.per} day${med.frequency.per > 1 ? 's' : ''}`,
                refillDate.toLocaleDateString('en-US'),
                daysUntil >= 0 ? `${daysUntil} day${daysUntil === 1 ? '' : 's'} remaining` : `expired ${Math.abs(daysUntil)} day${daysUntil === 1 ? '' : 's'} ago`,
                statusDisplay,
            ];
        });
}
