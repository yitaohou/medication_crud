// Time constants
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MILLISECONDS_PER_DAY = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

// Medication expiry thresholds
export const DEFAULT_EXPIRING_DAYS = 7;

// UI constants
export const AUTOCOMPLETE_DEBOUNCE_MS = 300;

// Validation constants
export const MAX_MEDICATION_NAME_LENGTH = 200;
export const MAX_NOTE_LENGTH = 1000;
export const MAX_DOSAGE_TOTAL = 999;
export const MAX_FREQUENCY_PER = 730; // 2 years
export const MAX_FREQUENCY_TIMES = 720; // max 1 dosage per minute

