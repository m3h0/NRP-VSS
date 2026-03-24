import { getDeadlineStatus } from '@/lib/utils';

export default function UpcomingDeadlines({ deadlines }: { deadlines: any[] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">
                    Upcoming Deadlines
                </h3>
                <button className="text-primary text-sm font-medium hover:underline">
                    See Calendar
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3" scope="col">
                                Course
                            </th>
                            <th className="px-6 py-3" scope="col">
                                Task
                            </th>
                            <th className="px-6 py-3" scope="col">
                                Due Date
                            </th>
                            <th className="px-6 py-3" scope="col">
                                Status
                            </th>
                            <th className="px-6 py-3" scope="col">
                                Priority
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {deadlines && deadlines.length > 0 ? (
                            deadlines.map((deadline) => {
                                const { status, color } = getDeadlineStatus(deadline.dueDate);
                                return (
                                    <DeadlineRow
                                        key={deadline.id}
                                        course={deadline.course.name}
                                        task={deadline.title}
                                        dueDate={new Date(deadline.dueDate).toLocaleDateString()}
                                        status={status}
                                        statusColor={color}
                                        priority={deadline.priority}
                                        priorityColor={
                                            deadline.priority === 'High'
                                                ? 'text-red-500'
                                                : deadline.priority === 'Medium'
                                                    ? 'text-yellow-500'
                                                    : 'text-slate-500'
                                        }
                                    />
                                );
                            })
                        ) : (
                            // Default rows if no data
                            <>
                                <DeadlineRow
                                    course="Calculus II"
                                    task="Weekly Problem Set 5"
                                    dueDate="Tomorrow, 11:59 PM"
                                    status="In Progress"
                                    statusColor="bg-yellow-100 text-yellow-800"
                                    priority="High"
                                    priorityColor="text-red-500"
                                />
                                <DeadlineRow
                                    course="CS 101"
                                    task="Midterm Project Proposal"
                                    dueDate="Oct 24, 5:00 PM"
                                    status="Not Started"
                                    statusColor="bg-slate-100 text-slate-800"
                                    priority="Medium"
                                    priorityColor="text-yellow-500"
                                />
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DeadlineRow({
    course,
    task,
    dueDate,
    status,
    statusColor,
    priority,
    priorityColor,
}: {
    course: string;
    task: string;
    dueDate: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
}) {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-900">
                {course}
            </td>
            <td className="px-6 py-4">{task}</td>
            <td className="px-6 py-4 text-slate-500">
                {dueDate}
            </td>
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                >
                    {status}
                </span>
            </td>
            <td className={`px-6 py-4 font-bold ${priorityColor}`}>{priority}</td>
        </tr>
    );
}
