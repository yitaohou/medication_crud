'use client';

import { useState } from 'react';
import MedicationModal from '@/app/components/medication/MedicationModal';
import { ModalMode, Medication } from '@/app/types';

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
        mode={ModalMode.EDIT}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        medication={medication}
      />
    </>
  );
}