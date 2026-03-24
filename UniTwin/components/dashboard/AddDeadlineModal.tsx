
'use client';

import { createDeadline } from '@/app/actions/deadline';
import { useState } from 'react';

type Course = {
    id: string;
    code: string;
    name: string;
};

export function AddDeadlineModal({
    isOpen,
    onClose,
    courses,
}: {
    isOpen: boolean;
    onClose: () => void;
    courses: Course[];
}) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createDeadline(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create deadline');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Add New Deadline</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. Midterm Exam"
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Course
                        </label>
                        <select
                            name="courseId"
                            required
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Select a course...</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                required
                                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Deadline'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
