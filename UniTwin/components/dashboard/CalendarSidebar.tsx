
'use client';

import { useState } from 'react';
import { AddDeadlineModal } from './AddDeadlineModal';

type Course = {
    id: string;
    code: string;
    name: string;
};

export function CalendarSidebar({ courses }: { courses: Course[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-3"
                >
                    Add New Deadline
                </button>
                <button className="w-full py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Sync with Google Calendar
                </button>
            </div>

            <AddDeadlineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courses={courses}
            />
        </div>
    );
}
