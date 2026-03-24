import Link from 'next/link';

export default function HealthStats({ profile }: { profile?: any }) {
    const dropoutRisk = profile?.dropoutRisk ?? 12;
    const overloadRisk = profile?.overloadRisk ?? 78;
    const wellbeingScore = profile?.wellbeingScore ?? 85;
    const attendanceRate = profile?.attendanceRate ?? 95;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900 text-xl font-bold text-white">
                    Digital Twin Health
                </h2>
                <Link href="/dashboard/analytics" className="text-primary text-sm font-medium hover:underline">
                    View Full Report
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HealthCard
                    title="Dropout Risk"
                    value={`${dropoutRisk}%`}
                    change="-2% from last month"
                    icon="trending_down"
                    bgIcon="school"
                    colorClass="text-green-500"
                    bgClass="bg-green-500/10"
                    fillColor="bg-green-500"
                    percentage={dropoutRisk}
                />
                <HealthCard
                    title="Overload Risk"
                    value={`${overloadRisk}%`}
                    change="+15% critical increase"
                    icon="warning"
                    colorClass="text-red-500"
                    bgClass="bg-red-500/10"
                    fillColor="bg-red-500"
                    percentage={overloadRisk}
                />
                <HealthCard
                    title="Well-being Score"
                    value={`${wellbeingScore}`}
                    change="Stable condition"
                    icon="psychology"
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                    fillColor="bg-primary"
                    percentage={wellbeingScore}
                />
                <HealthCard
                    title="Attendance"
                    value={`${attendanceRate}%`}
                    change="Consistent"
                    icon="check_circle"
                    colorClass="text-blue-400"
                    bgClass="bg-blue-400/10"
                    fillColor="bg-blue-400"
                    percentage={attendanceRate}
                />
            </div>
        </div>
    );
}

function HealthCard({
    title,
    value,
    change,
    icon,
    bgIcon,
    colorClass,
    bgClass,
    fillColor,
    percentage,
}: {
    title: string;
    value: string;
    change: string;
    icon: string;
    bgIcon?: string;
    colorClass: string;
    bgClass: string;
    fillColor: string;
    percentage: number;
}) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
                <div>
                    <p className="text-slate-600 text-sm font-medium">
                        {title}
                    </p>
                    <h3 className="text-slate-900 text-3xl font-bold mt-1">
                        {value}
                    </h3>
                </div>
                <div className={`${bgClass} ${colorClass} p-1.5 rounded-lg`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
            </div>
            <div className="z-10">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                        className={`${fillColor} h-full rounded-full`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className={`${colorClass} text-xs font-medium mt-2`}>{change}</p>
            </div>
            {bgIcon && (
                <div className="absolute -bottom-4 -right-4 text-slate-100 opacity-20">
                    <span className="material-symbols-outlined text-8xl">{bgIcon}</span>
                </div>
            )}
        </div>
    );
}
