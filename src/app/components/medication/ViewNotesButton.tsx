'use client';

import { useState } from 'react';
import NotesModal from './NotesModals';

type ViewNotesButtonProps = {
    note: string;
    name: string;
    dnc?: string;
};

export default function ViewNotesButton({ note, name, dnc }: ViewNotesButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Don't show button if no notes
    if (!note) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
                view notes
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