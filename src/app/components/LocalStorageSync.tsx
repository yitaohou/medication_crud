'use client';

import { useLocalStorageSync } from '@/app/hooks/useLocalStorageSync';
import { Medication } from '@/app/types';

type LocalStorageSyncProps = {
    medications: Medication[];
};

export default function LocalStorageSync({ medications }: LocalStorageSyncProps) {
    useLocalStorageSync(medications);
    return null;
}