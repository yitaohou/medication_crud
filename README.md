# Medication CRUD Application

A web application for tracking and managing medication schedules, refill dates, and dosage information.

## Run Instructions

1. Install dependencies:
npm install

2. Start the development server:
npm run dev

3. Open http://localhost:3000 in your browser to view the application.


## Features

- add new medications with form validation
- view medication list
- edit existing medication
- delete medications
- mark dosage as taken or missed
- show the start date and refill date for each medication
- show the dosage frequency for each medication
- show the total dosage and remaining dosage for each medication
- show the refill status for each medication
- automatic calculation of refill dates based on usage and frequency
- Progress tracking for taken vs missed doses
- adherence percentage for missed doses vs supposed to be taken doses
- badges for expired and expiring medications
- warning for expired medications (banner)
- view a list of expired medications (modal)
- warning for expiring medications (banner)
- view a list of expiring medications (modal)

## Bonus Features

- export the schedule to a csv/pdf file
- use FDA API for medication search (auto-complete search bar with debounce)
- local storage for persistent data
- show medication details from FDA database (modal)
- reset all medications functionality
- event subscription for medication changes for banner/medication list

## TODO

- adding reset today's take/miss functionality
- responsive design
- do the dosage condition for each day? e.g. 3 times per day medication, then the user is able to mark any of them as taken or missed
- migration to the tanstack query
- validation checks for modification EP?

## API Endpoints

### Medications

- GET /api/medications - Get all medications
- POST /api/medications - Create a new medication
- GET /api/medications/[id] - Get a single medication
- PUT /api/medications/[id] - Update a medication
- DELETE /api/medications/[id] - Delete a medication
- POST /api/medications/[id]/take - Mark medication as taken
- POST /api/medications/[id]/miss - Mark medication as missed
- GET /api/medications/count - Get the count of medications
- GET /api/medications/expired - Get expired medications
- GET /api/medications/expiring - Get expiring medications
- POST /api/medications/reset - Reset all medications
- POST /api/medications/restore - Restore medications from local storage

### External API

- FDA OpenFDA Drug API - Fetch medication details by NDC code

## Technology Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- jsPDF (PDF export)
- Local storage for data persistence