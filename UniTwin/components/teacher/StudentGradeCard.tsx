
'use client';

import { useState } from 'react';

interface Grade {
    id: string;
    grade: number;
    semester: string;
    createdAt: Date;
}

interface Course {
    id: string;
    name: string;
    code: string;
}

interface Props {
    enrollment: {
        id: string;
        currentLoad: string;
        courseId: string;
        course: Course;
    };
    grades: Grade[];
}

export function StudentGradeCard({ enrollment, grades }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const latestGrade = grades[0]; // Assumes grades are sorted DESC

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{enrollment.course.name}</h3>
                    <p className="text-sm text-slate-500">{enrollment.course.code}</p>
                </div>
                {latestGrade ? (
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-teal-600">
                            {latestGrade.grade.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">{latestGrade.semester}</span>
                    </div>
                ) : (
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">
                        No Grade
                    </span>
                )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div className="text-sm">
                    <span className="text-slate-500">Current Load: </span>
                    <span className={`font-medium ${enrollment.currentLoad === 'High' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {enrollment.currentLoad}
                    </span>
                </div>

                <div className="flex gap-3">
                    {grades.length > 1 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1"
                        >
                            {isExpanded ? 'Hide History' : 'History'}
                            <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                    )}
                    <a
                        href={`/teacher/courses/${enrollment.courseId}`}
                        className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                    >
                        View Course
                    </a>
                </div>
            </div>

            {/* Expanded History */}
            {isExpanded && grades.length > 1 && (
                <div className="mt-4 pt-4 border-t border-dashed border-slate-200 animate-in slide-in-from-top-2 fade-in duration-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Grade History</h4>
                    <div className="space-y-2">
                        {grades.map((grade) => (
                            <div key={grade.id} className="flex justify-between text-sm items-center">
                                <span className="text-slate-500">{grade.semester}</span>
                                <span className="font-bold text-slate-700">{grade.grade.toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
