'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteMedicationButtonProps = {
  medicationId: number;
  medicationName: string;
};

export default function DeleteMedicationButton({ medicationId, medicationName }: DeleteMedicationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${medicationName}?`);

    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/medications/${medicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete medication');
      }

      const result = await response.json();
      console.log('Deleted:', result);

      router.refresh();

      alert(`${medicationName} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert(`Failed to delete ${medicationName}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={isLoading}
      title={isLoading ? 'Loading...' : 'Delete Medication'}
    >
      Delete
    </button>
  );
}