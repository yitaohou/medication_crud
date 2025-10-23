'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateDosageRemaining, calculateMaxAllowance, calculateRefillDate, getTodayDateString } from '@/app/utils';
import { Medication, MedicationInput } from '@/app/types';
import Modal from '@/app/components/ui/Modal';
import Autocomplete from '@/app/components/ui/Autocomplete';
import { searchDrugs } from '@/app/lib/drugApi';
import { ModalMode } from '@/app/types';
import { medicationEvents } from '@/app/lib/medicationEvents';
import { AUTOCOMPLETE_DEBOUNCE_MS, MAX_DOSAGE_TOTAL, MAX_FREQUENCY_PER, MAX_FREQUENCY_TIMES, MAX_MEDICATION_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/app/const';

type MedicationModalProps = {
    mode: ModalMode;
    isOpen: boolean;
    onClose: () => void;
    medication?: Medication;
};

const getInitialFormData = (mode: ModalMode, medication?: Medication) => {
    return mode === ModalMode.EDIT && medication ? {
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
};

export default function MedicationModal({ mode, isOpen, onClose, medication }: MedicationModalProps) {
    const router = useRouter();

    const [formData, setFormData] = useState(() => getInitialFormData(mode, medication));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData(mode, medication));
        }
    }, [isOpen, mode, medication]);

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

    const todayMissed = useMemo(() => {
        const today = getTodayDateString();
        if (medication?.lastDayAction && medication.lastDayAction.date === today) {
            return medication.lastDayAction.miss || 0;
        }
        return 0;
    }, [medication]);

    const minMissedDosage = todayMissed;
    const maxMissedDosage = maxAllowance + todayMissed;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const url = mode === ModalMode.ADD
                ? '/api/medications'
                : `/api/medications/${medication?.id}`;

            const method = mode === ModalMode.ADD ? 'POST' : 'PUT';

            const dosageMissed = Math.min(formData.dosageMissed, maxAllowance);

            const body: MedicationInput = {
                name: formData.name,
                dosageTotal: formData.dosageTotal,
                dosageRemaining: calculateDosageRemaining(formData.startDate, formData.frequencyPer, formData.frequencyTimes, formData.dosageTotal, dosageMissed, medication?.lastDayAction),
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
            console.log(`${mode === ModalMode.ADD ? 'Added' : 'Updated'}:`, result);

            onClose();

            router.refresh();

            medicationEvents.emit();

            alert(`Medication ${mode === ModalMode.ADD ? 'added' : 'updated'} successfully!`);
        } catch (error) {
            console.error(`Error ${mode === ModalMode.ADD ? 'adding' : 'updating'} medication:`, error);
            alert(`Failed to ${mode === ModalMode.ADD ? 'add' : 'update'} medication`);
        } finally {
            setIsLoading(false)
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode === ModalMode.ADD ? 'Add' : 'Edit'} Medication`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="modal-field">
                        Medication Name *
                    </label>
                    <Autocomplete
                        value={formData.name}
                        onChange={(value, dnc) => {
                            if (value.length <= MAX_MEDICATION_NAME_LENGTH) {
                                setFormData({ ...formData, name: value, dnc: dnc });
                            }
                        }} onSearch={async (query) => {
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
                        debounceMs={AUTOCOMPLETE_DEBOUNCE_MS}
                    />
                    {formData.name.length >= MAX_MEDICATION_NAME_LENGTH && (
                        <p className="text-xs text-red-600 mt-1">Maximum character limit reached</p>
                    )}
                </div>

                <div>
                    <label className="modal-field">
                        Total Dosage *
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        max={MAX_DOSAGE_TOTAL}
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
                            min={minMissedDosage}
                            max={maxMissedDosage}
                            value={formData.dosageMissed}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (value >= minMissedDosage && value <= maxMissedDosage) {
                                    setFormData({ ...formData, dosageMissed: value });
                                }
                            }}
                            className="modal-input"
                            placeholder="e.g., 5"
                        />
                    </div>
                )}

                <div>
                    <label className="modal-field">
                        Dosage Remaining:&nbsp;
                        <span>{calculateDosageRemaining(formData.startDate, formData.frequencyPer, formData.frequencyTimes, formData.dosageTotal, formData.dosageMissed, medication?.lastDayAction)}</span>
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
                            max={MAX_FREQUENCY_TIMES}
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
                            max={MAX_FREQUENCY_PER}
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
                        Note (Optional)
                    </label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_NOTE_LENGTH) {
                                setFormData({ ...formData, note: e.target.value });
                            }
                        }}
                        className="modal-input resize-y min-h-[80px]"
                        placeholder="e.g., two tablets per take, avoid alcohol"
                        rows={3}
                    />
                    {formData.note && formData.note.length >= MAX_NOTE_LENGTH && (
                        <p className="text-xs text-red-600 mt-1">Maximum character limit reached</p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 btn bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                        title={isLoading ? 'Loading...' : mode === 'add' ? 'Add Medication' : 'Update Medication'}
                    >
                        {mode === 'add' ? 'Add' : 'Update'} Medication
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>

    );
}