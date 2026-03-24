import Link from 'next/link';

export function GPATrajectoryChart({ grades }: { grades: any[] }) {
    // Process grades to calculate GPA per semester
    const semesterGPAs = grades.reduce((acc: any, grade: any) => {
        if (!acc[grade.semester]) {
            acc[grade.semester] = { sum: 0, count: 0 };
        }
        acc[grade.semester].sum += grade.grade;
        acc[grade.semester].count += 1;
        return acc;
    }, {});

    const chartData = Object.keys(semesterGPAs).map((sem) => ({
        semester: sem,
        gpa: semesterGPAs[sem].sum / semesterGPAs[sem].count,
    })).sort((a, b) => a.semester.localeCompare(b.semester)); // Simple sort, improves needs better logic for "Sem 1" vs "Fall 2024"

    // If no data, show empty state or default
    const hasData = chartData.length > 0;
    const currentGPA = hasData ? chartData[chartData.length - 1].gpa.toFixed(2) : 'N/A';

    // SVG scaling
    const width = 800;
    const height = 300;
    const padding = 40;
    const graphHeight = height - padding * 2;
    const graphWidth = width; // Use full width

    // Y-axis: 0.0 to 4.0
    const getY = (gpa: number) => height - padding - (gpa / 4.0) * graphHeight;
    // X-axis: distribute points
    const getX = (index: number) => padding + (index / (Math.max(chartData.length - 1, 1))) * (width - 2 * padding);

    // Generate Path
    let pathD = '';
    let points = '';
    if (hasData) {
        pathD = `M ${getX(0)} ${getY(chartData[0].gpa)}`;
        chartData.forEach((d, i) => {
            if (i === 0) return;
            pathD += ` L ${getX(i)} ${getY(d.gpa)}`;
        });
    }

    // Gradient Area
    const areaPath = hasData ? `${pathD} V ${height} H ${getX(0)} Z` : '';

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        GPA Trajectory
                    </h3>
                    <p className="text-sm text-slate-600">
                        Current {currentGPA}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Actual
                    </span>
                </div>
            </div>
            {/* Chart */}
            <div className="relative w-full h-64">
                {hasData ? (
                    <svg
                        className="w-full h-full overflow-visible"
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="none"
                    >
                        {/* Grid Lines */}
                        {[1, 2, 3, 4].map((val) => (
                            <line
                                key={val}
                                stroke="#e2e8f0"
                                strokeDasharray="4 4"
                                strokeWidth="1"
                                x1="0"
                                x2={width}
                                y1={getY(val)}
                                y2={getY(val)}
                            />
                        ))}

                        {/* Area */}
                        <defs>
                            <linearGradient id="gpaGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2b7cee" stopOpacity="0.3"></stop>
                                <stop offset="100%" stopColor="#2b7cee" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#gpaGradient)" />

                        {/* Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#2b7cee"
                            strokeWidth="3"
                        />

                        {/* Points */}
                        {chartData.map((d, i) => (
                            <circle
                                key={d.semester}
                                cx={getX(i)}
                                cy={getY(d.gpa)}
                                r="6"
                                fill="white"
                                stroke="#2b7cee"
                                strokeWidth="3"
                                className="hover:r-8 transition-all cursor-pointer"
                            >
                                <title>{`${d.semester}: ${d.gpa.toFixed(2)}`}</title>
                            </circle>
                        ))}
                        {/* Y Labels */}
                        {[1, 2, 3, 4].map((val) => (
                            <text key={val} className="text-xs fill-slate-500" x="-20" y={getY(val) + 4}>
                                {val}.0
                            </text>
                        ))}
                    </svg>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No GPA data available
                    </div>
                )}

                {/* X Labels */}
                <div className="flex justify-between mt-2 text-xs text-slate-500 px-1 absolute w-full bottom-0">
                    {chartData.map((d, i) => (
                        <span key={d.semester} style={{ position: 'absolute', left: `calc(${(i / (Math.max(chartData.length - 1, 1))) * 100}% - 20px)` }}>
                            {d.semester}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function WorkloadSummary({ enrollments }: { enrollments: any[] }) {
    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                Current Workload
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                {enrollments && enrollments.length > 0 ? (
                    enrollments.map((enrollment) => {
                        const hours = enrollment.course.credits * 2;
                        const isHigh = hours >= 10;
                        const isLight = hours <= 4;
                        const status = isHigh ? 'High' : isLight ? 'Light' : 'Optimal';

                        return (
                            <WorkloadItem
                                key={enrollment.id}
                                subject={enrollment.course.name}
                                status={status}
                                statusColor={
                                    isHigh
                                        ? 'text-red-400'
                                        : isLight
                                            ? 'text-blue-500'
                                            : 'text-green-500'
                                }
                                progress={
                                    hours * 7 // Mock calc for bar width
                                }
                                progressColor={
                                    isHigh
                                        ? 'bg-red-500'
                                        : isLight
                                            ? 'bg-blue-500'
                                            : 'bg-green-500'
                                }
                                details={`${hours} hrs/week`}
                            />
                        )
                    })
                ) : (
                    <>
                        {/* Default dummy content if no data */}
                        <WorkloadItem
                            subject="Calculus II"
                            status="High Load"
                            statusColor="text-red-400"
                            progress={85}
                            progressColor="bg-red-500"
                            details="12 hrs/week (Rec: 8 hrs)"
                        />
                        <WorkloadItem
                            subject="Data Structures"
                            status="Optimal"
                            statusColor="text-primary"
                            progress={60}
                            progressColor="bg-primary"
                            details="8 hrs/week"
                        />
                    </>
                )}
            </div>
            <Link href="/dashboard/coursework" className="mt-6 w-full py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center block">
                Log Study Hours
            </Link>
        </div>
    );
}

function WorkloadItem({
    subject,
    status,
    statusColor,
    progress,
    progressColor,
    details,
}: {
    subject: string;
    status: string;
    statusColor: string;
    progress: number;
    progressColor: string;
    details: string;
}) {
    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <p className="text-sm font-medium text-slate-700">
                    {subject}
                </p>
                <p className={`text-xs font-bold ${statusColor}`}>{status}</p>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                    className={`${progressColor} h-full rounded-full`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-600 mt-1">{details}</p>
        </div>
    );
}
