'use client';

import { useState } from 'react';
import MedicationModal from './MedicationModal';
import { Medication } from '../../types';

type EditMedicationButtonProps = {
  medication: Medication;
};

export default function EditMedicationButton({ medication }: EditMedicationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn bg-blue-500 hover:bg-blue-600"
      >
        Edit
      </button>

      <MedicationModal
        mode="edit"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        medication={medication}
      />
    </>
  );
}