'use client';

import { useState } from 'react';
import NotesModal from '@/app/components/medication/NotesModals';

type ViewNotesButtonProps = {
    note: string;
    name: string;
    dnc?: string;
};

export default function ViewNotesButton({ note, name, dnc }: ViewNotesButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-button text-blue-600 hover:text-blue-800"
            >
                view details
            </button>
            <NotesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                name={name}
                note={note}
                dnc={dnc}
            />
        </>
    );
}