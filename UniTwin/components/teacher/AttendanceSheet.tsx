
'use client';

import { useState, useTransition, useEffect } from 'react';
import { logAttendance, getCourseAttendance } from '@/app/actions/attendance';

interface Student {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

interface Props {
    courseId: string;
    students: Student[];
    onClose: () => void;
}

export function AttendanceSheet({ courseId, students, onClose }: Props) {
    const [isPending, startTransition] = useTransition();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [statuses, setStatuses] = useState<Record<string, string>>({});
    const [loadingData, setLoadingData] = useState(false);

    // Fetch existing attendance when date changes
    // Fetch existing attendance when date changes
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoadingData(true);
            try {
                const records = await getCourseAttendance(courseId, date);
                if (records) {
                    const newStatuses: Record<string, string> = {};
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    records.forEach((r: any) => {
                        newStatuses[r.studentId] = r.status;
                    });
                    setStatuses(newStatuses);
                } else {
                    setStatuses({});
                }
            } catch (error) {
                console.error("Failed to fetch attendance:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchAttendance();
    }, [courseId, date]);

    // Use effect for subsequent changes
    const handleDateChange = async (newDate: string) => {
        setDate(newDate);
        setLoadingData(true);
        // Clear old statuses while loading
        setStatuses({});
        try {
            const records = await getCourseAttendance(courseId, newDate);
            if (records) {
                const newStatuses: Record<string, string> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                records.forEach((r: any) => {
                    newStatuses[r.studentId] = r.status;
                });
                setStatuses(newStatuses);
            }
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleStatusChange = (studentId: string, status: string) => {
        setStatuses(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await logAttendance(formData);
            if (result.error) {
                alert(result.error);
            } else {
                alert("Attendance logged successfully!");
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Take Attendance</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form action={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1">
                        <input type="hidden" name="courseId" value={courseId} />

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                required
                            />
                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-2 text-sm font-semibold text-slate-700">Student</th>
                                    <th className="py-2 text-sm font-semibold text-slate-700 text-center">Present</th>
                                    <th className="py-2 text-sm font-semibold text-slate-700 text-center">Absent</th>
                                    <th className="py-2 text-sm font-semibold text-slate-700 text-center">Late</th>
                                    <th className="py-2 text-sm font-semibold text-slate-700 text-center">Excused</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="py-3 text-sm font-medium text-slate-900">
                                            {student.name || student.email}
                                        </td>
                                        {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
                                            <td key={status} className="py-3 text-center">
                                                <input
                                                    type="radio"
                                                    name={`status-${student.id}`}
                                                    value={status}
                                                    checked={statuses[student.id] === status || (status === 'PRESENT' && !statuses[student.id])}
                                                    onChange={() => handleStatusChange(student.id, status)}
                                                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                                            No students enrolled in this course.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || students.length === 0}
                            className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
