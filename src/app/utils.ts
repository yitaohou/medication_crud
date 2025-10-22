import { Frequency, Medication } from "./types";


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
    RefillDate.setDate(RefillDate.getDate() + totalDays + totalMissedDays);

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

    const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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

    const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dosesPerDay = frequencyTimes / frequencyPer;
    const expectedDosage = Math.ceil(daysPassed * dosesPerDay);

    return expectedDosage;
}

export const getRefillStatus = (
    refillDate: Date,
    remainingDosage: number,
): 'expired' | 'ending-soon' | 'normal' => {
    if (remainingDosage === 0) {
        return 'expired';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    refillDate.setHours(0, 0, 0, 0);

    const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilRefill < 0) {
        return 'expired';
    } else if (daysUntilRefill <= 7) {
        return 'ending-soon';
    } else {
        return 'normal';
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
            
            const daysUntil = Math.floor((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const status = getRefillStatus(new Date(med.refillDate), med.dosageRemaining);
            const statusDisplay = status === 'expired' ? 'Expired' : status === 'ending-soon' ? 'Soon' : 'Normal';
            
            return [
                med.name,
                `${med.dosageRemaining} / ${med.dosageTotal}`,
                `${med.frequency.times}x per ${med.frequency.per} day${med.frequency.per > 1 ? 's' : ''}`,
                refillDate.toLocaleDateString('en-US'),
                daysUntil >= 0 ? `${daysUntil} days` : `${Math.abs(daysUntil)} days ago`,
                statusDisplay,
            ];
        });
}

//TODOS:
//11. use the local storage to store the medications
//12. responsive design
// summary of 10-13: bonus features
//13. testing the export functionality and simplify the code in the component
//14. migration to the tanstack query
//15. clean up some code, duplicate css
//17. change all import to @/app/ styles
//18. maybe not to change the form data each time the user types
//19. do the enum type for 'expired' | 'ending-soon' | 'normal'
//20. do the re-fetch for the expiring and expired EP after editing/add medication
//21. do the re-fetch for the expiring and expired EP after deleting medication

// summary of 14-19: clean up and optimization
//24. do the dosage condition?


//DONE:
//1. (done) move the calculation of refill dates into the store (add refillDate to the Medication type), keep add the refill date calculation logic to the modal
//2. (wont do) move the percentage of taken/miss into the store and add it into the type.
//3. (wont do) move the percentage of remaining into the store as well.
//4. (wont do) move the getRefillStatus into the store as well.
// summary of 1-4: eliminate the calculation in FE in terms of displaying the whole table
//5. (done) add the description and amount per take into the store and add it into the type. And also add view detail button below the name. Clicking will show a detailed modal.
//6. (done) change the banner showing the soonest expiry to show the soonest expiry medication and the total amount of medication expiring in 7 days.
//7. (done) clicking the button will show a modal listing all the medications expiring in 7 days. 
//8. (done) having another banner showing the amount of medication that have already expired with a view all button.
//9. (done) clicking the view all button will show a modal listing all the medications that have already expired.
// summary of 5-9: enrichment of required features
//10.(done) add the public API for the medication name
//16.(done) using debounce for the search
//23.(wont do) change the EP to light weight
//13.(done) export the schedule to a csv/pdf file
