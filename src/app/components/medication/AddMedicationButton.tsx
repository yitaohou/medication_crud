'use client';

import { useState } from 'react';
import MedicationModal from '@/app/components/medication/MedicationModal';
import { ModalMode } from '@/app/types';

export default function AddMedicationButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-lg bg-green-500 hover:bg-green-600"
      >
        + Add Medication
      </button>

      <MedicationModal
        mode={ModalMode.ADD}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}