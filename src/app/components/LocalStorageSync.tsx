'use client';

import { useLocalStorageSync } from '../hooks/useLocalStorageSync';
import { Medication } from '../types';

type LocalStorageSyncProps = {
    medications: Medication[];
};

export default function LocalStorageSync({ medications }: LocalStorageSyncProps) {
    useLocalStorageSync(medications);
    return null;
}