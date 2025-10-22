'use client';

import { useState } from 'react';
import MedicationModal from './MedicationModal';

export default function AddMedicationButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn bg-green-500 hover:bg-green-600"
      >
        + Add Medication
      </button>

      <MedicationModal
        mode="add"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}