import Link from 'next/link';
import { SidebarNav } from './SidebarNav';

export default function Sidebar() {
    return (
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
            <div className="flex items-center gap-3 px-6 py-6">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDB2J2N-ntS_uniwRyybRV2IFGBkrMbHcECw7ufK7t4w39gmHktk5h4gM3gzvWJrQkh5qZmk4WGyQRbCm3tBbRritX9cvHu6_IvdZIGBmBTVzpjDXPzn-cHl2K-ymsKDRtQHossSs-1rG3qLzuQ0Ga1mIiyGw0HI_ttuYleUfIGBv-Op_bTaNWH3HiOUOct7OCqWbqQbZAWxsr6HzCkoHWT1LkZDdYSIWSOMssX_BNvi4b_ks7FHP51pvw0b8izROmAEqk0mbhVZCk")',
                    }}
                ></div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 text-lg font-bold leading-normal">
                        UniTwin
                    </h1>
                    <p className="text-slate-500 text-xs font-normal leading-normal">
                        Academic Risk System
                    </p>
                </div>
            </div>
            <SidebarNav />
        </aside>
    );
}
