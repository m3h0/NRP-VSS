'use client';

import { useState } from 'react';

export function NotificationSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                <p className="text-slate-500 text-sm">Choose how you want to be notified.</p>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900">Email Alerts</p>
                        <p className="text-xs text-slate-500">Receive daily summaries of your deadlines.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEmailAlerts(!emailAlerts)}
                        className={`w-11 h-6 rounded-full relative transition-colors ${emailAlerts ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <div
                            className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`}
                        ></div>
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900">Push Notifications</p>
                        <p className="text-xs text-slate-500">Get real-time updates on your phone.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setPushNotifs(!pushNotifs)}
                        className={`w-11 h-6 rounded-full relative transition-colors ${pushNotifs ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <div
                            className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-transform ${pushNotifs ? 'translate-x-6' : 'translate-x-1'}`}
                        ></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
