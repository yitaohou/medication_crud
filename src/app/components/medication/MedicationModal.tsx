'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { calculateDosageRemaining, calculateMaxAllowance, calculateRefillDate } from '../../utils';
import { Medication, MedicationInput } from '../../types';
import Modal from '../ui/Modal';
import Autocomplete from '../ui/Autocomplete';
import { searchDrugs } from '@/app/lib/drugApi';

type MedicationModalProps = {
    mode: 'add' | 'edit';
    isOpen: boolean;
    onClose: () => void;
    medication?: Medication;
};

export default function MedicationModal({ mode, isOpen, onClose, medication }: MedicationModalProps) {

    const router = useRouter();

    const initialFormData = mode === 'edit' && medication ? {
        name: medication.name,
        dosageTotal: medication.dosageTotal,
        dosageRemaining: medication.dosageRemaining,
        dosageMissed: medication.dosageMissed,
        frequencyTimes: medication.frequency.times,
        frequencyPer: medication.frequency.per,
        startDate: medication.startDate.split('T')[0],
        note: medication.note,
        dnc: medication.dnc,
    } : {
        name: '',
        dosageTotal: 0,
        dosageRemaining: 0,
        dosageMissed: 0,
        frequencyTimes: 1,
        frequencyPer: 1,
        startDate: new Date().toISOString().split('T')[0],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const showMissedField = useMemo(() => {
        const [year, month, day] = formData.startDate.split('-').map(Number);
        const startDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        return startDate < today;
    }, [formData.startDate]);

    const maxAllowance = useMemo(() => {
        return calculateMaxAllowance(formData.startDate, formData.frequencyPer, formData.frequencyTimes);
    }, [formData.startDate, formData.frequencyPer, formData.frequencyTimes]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const url = mode === 'add'
                ? '/api/medications'
                : `/api/medications/${medication?.id}`;

            const method = mode === 'add' ? 'POST' : 'PUT';

            const dosageMissed = Math.min(formData.dosageMissed, maxAllowance);

            const body: MedicationInput = {
                name: formData.name,
                dosageTotal: formData.dosageTotal,
                dosageRemaining: calculateDosageRemaining(formData.startDate, formData.frequencyPer, formData.frequencyTimes, formData.dosageTotal, dosageMissed),
                dosageMissed: dosageMissed,
                frequency: {
                    times: formData.frequencyTimes,
                    per: formData.frequencyPer,
                },
                startDate: formData.startDate,
                note: formData.note,
                dnc: formData.dnc,
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Failed to ${mode} medication`);
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Failed to ${mode} medication`);
            }

            const result = await response.json();
            console.log(`${mode === 'add' ? 'Added' : 'Updated'}:`, result);

            onClose();

            router.refresh();

            alert(`Medication ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        } catch (error) {
            console.error(`Error ${mode}ing medication:`, error);
            alert(`Failed to ${mode} medication`);
        } finally {
            setIsLoading(false)
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode === 'add' ? 'Add' : 'Edit'} Medication`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="modal-field">
                        Medication Name *
                    </label>
                    <Autocomplete
                        value={formData.name}
                        onChange={(value, dnc) => setFormData({ ...formData, name: value, dnc: dnc })}
                        onSearch={async (query) => {
                            const results = await searchDrugs(query);
                            return results.map(drug => ({
                                label: drug.brand_name,
                                sublabel: drug.generic_name ? `Generic: ${drug.generic_name}` : undefined,
                                dnc: drug.product_ndc,
                            }));
                        }}
                        placeholder="e.g., Aspirin, Tylenol, Advil"
                        required
                        className="modal-input"
                        debounceMs={300}
                    />
                </div>

                <div>
                    <label className="modal-field">
                        Total Dosage *
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.dosageTotal}
                        onChange={(e) => setFormData({ ...formData, dosageTotal: parseInt(e.target.value) || 0 })}
                        className="modal-input"
                        placeholder="e.g., 30"
                    />
                </div>

                {showMissedField && (
                    <div>
                        <label className="modal-field">
                            Dosage Missed in the Past *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            max={Math.min(formData.dosageTotal, maxAllowance)}
                            value={formData.dosageMissed}
                            onChange={(e) => setFormData({ ...formData, dosageMissed: parseInt(e.target.value) || 0 })}
                            className="modal-input"
                            placeholder="e.g., 5"
                        />
                    </div>
                )}

                <div>
                    <label className="modal-field">
                        Dosage Remaining:&nbsp;
                        <span>{calculateDosageRemaining(formData.startDate, formData.frequencyPer, formData.frequencyTimes, formData.dosageTotal, formData.dosageMissed)}</span>
                    </label>
                </div>

                <div>
                    <label className="modal-field">
                        Estimated Refill Date:&nbsp;
                        <span>{calculateRefillDate(formData.startDate, formData.dosageMissed, formData.dosageTotal, formData.frequencyTimes, formData.frequencyPer).toLocaleDateString('en-US')}</span>
                    </label>
                </div>

                <div>
                    <label className="modal-field">
                        Start Date *
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="modal-input"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="modal-field">
                            Times *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.frequencyTimes}
                            onChange={(e) => setFormData({ ...formData, frequencyTimes: parseInt(e.target.value) })}
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="modal-field">
                            Per (days) *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.frequencyPer}
                            onChange={(e) => setFormData({ ...formData, frequencyPer: parseInt(e.target.value) })}
                            className="modal-input"
                        />
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    Frequency: {formData.frequencyTimes} time{formData.frequencyTimes > 1 ? 's' : ''} per {formData.frequencyPer} day{formData.frequencyPer > 1 ? 's' : ''}
                </p>

                <div>
                    <label className="modal-field">
                        Dosage Per Take (Optional)
                    </label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="modal-input resize-y min-h-[80px]"
                        placeholder="e.g., two tablets per take, avoid alcohol"
                        rows={3}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 btn bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        title={isLoading ? 'Loading...' : mode === 'add' ? 'Add Medication' : 'Update Medication'}
                    >
                        {mode === 'add' ? 'Add' : 'Update'} Medication
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn bg-gray-300 hover:bg-gray-400 text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>

    );
}