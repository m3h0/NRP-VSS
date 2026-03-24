
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDeadlineStatus(dueDate: Date | string) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { status: 'Overdue', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 3) {
        return { status: 'Due Soon', color: 'bg-orange-100 text-orange-800' };
    } else if (diffDays <= 7) {
        return { status: 'In Progress', color: 'bg-blue-100 text-blue-800' };
    } else {
        return { status: 'Not Started', color: 'bg-slate-100 text-slate-800' };
    }
}
