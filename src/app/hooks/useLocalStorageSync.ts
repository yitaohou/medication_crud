'use client';

import { useEffect } from 'react';
import { Medication } from '../types';

const STORAGE_KEY = 'medication_crud_backup';

export function useLocalStorageSync(medications: Medication[]) {
    useEffect(() => {
        if (medications.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
        }
    }, [medications]);

    useEffect(() => {
        const restoreFromLocalStorage = async () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            try {
                const savedMedications: Medication[] = JSON.parse(saved);
                
                const { count } = await fetch('/api/medications/count').then(r => r.json());
                
                if (count === 0 && savedMedications.length > 0) {
                    await fetch('/api/medications/restore', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(savedMedications),
                    });
                    
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to restore from localStorage:', error);
            }
        };

        restoreFromLocalStorage();
    }, []);
}