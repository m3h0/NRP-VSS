
'use client';

import { useState } from 'react';
import { createGrade } from '@/app/actions/grade';

type Course = {
    id: string;
    code: string;
    name: string;
};

export function AddGradeButton({ courses }: { courses: Course[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createGrade(formData);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('Failed to add grade');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Grade
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Grade</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form action={handleSubmit} className="flex flex-col gap-4">
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
                                        Grade (GPA / 1-10)
                                    </label>
                                    <input
                                        type="number"
                                        name="grade"
                                        required
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        placeholder="e.g. 3.8"
                                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        name="semester"
                                        required
                                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="Sem 1">Sem 1</option>
                                        <option value="Sem 2">Sem 2</option>
                                        <option value="Sem 3">Sem 3</option>
                                        <option value="Sem 4">Sem 4</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg">
                                Tip: Adding a grade will automatically update your GPA Trajectory, Dropout Risk, and AI Insights.
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
