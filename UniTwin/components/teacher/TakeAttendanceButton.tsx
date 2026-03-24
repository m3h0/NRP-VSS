
'use client';

import { useState } from 'react';
import { AttendanceSheet } from './AttendanceSheet';

interface Student {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

interface Props {
    courseId: string;
    students: Student[];
}

export function TakeAttendanceButton({ courseId, students }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
                Take Attendance
            </button>

            {isOpen && (
                <AttendanceSheet
                    courseId={courseId}
                    students={students}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
