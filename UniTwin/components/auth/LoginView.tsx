'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';

// Tailwind Class Maps based on role to avoid inline style bugs with v4
const getTheme = (isTeacher: boolean) => ({
    primaryText: isTeacher ? 'text-teal-600' : 'text-primary',
    primaryTextHover: isTeacher ? 'hover:text-teal-700' : 'hover:text-primary/80',
    primaryBg: isTeacher ? 'bg-teal-600' : 'bg-primary',
    primaryBgHover: isTeacher ? 'hover:bg-teal-700' : 'hover:bg-primary/90',
    primaryRing: isTeacher ? 'focus:ring-teal-600/20' : 'focus:ring-primary/20',
    primaryBorder: isTeacher ? 'border-teal-600/20' : 'border-primary/20',
    bgLight: isTeacher ? 'bg-teal-600/10' : 'bg-primary/10',
    bgMedium: isTeacher ? 'bg-teal-600/20' : 'bg-primary/20',
    bgGradientStart: isTeacher ? 'to-teal-600/20' : 'to-primary/20',
    bgGradientEnd: isTeacher ? 'from-teal-600/30' : 'from-primary/30',
    iconHoverText: isTeacher ? 'group-hover:text-teal-600' : 'group-hover:text-primary',
    iconHoverBg: isTeacher ? 'group-hover:bg-teal-600/10' : 'group-hover:bg-primary/10',
});

export default function LoginView() {
    const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
    const isTeacher = role === 'TEACHER';
    const theme = getTheme(isTeacher);

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row transition-colors duration-500">
            {/* Left Side: Image / Hero */}
            <div className="relative hidden w-full lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between bg-surface-dark p-12 overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-all duration-700"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhNiEb75xlpmX6gf8r7bbJSdvMPgNX0yaDKq79GM1NnHdYDJEOzco6T2hF70BIPw9d8BxYQ_CDOlzsymQMBP6hsxC-oQxAJzGatucJs9O1zW0Q_cADUhXf8Guou077vZH4aGuDVnqZmRwnC0SvROeojD2bok1nH0IavcvJcLLZcIcwVgTWXwPVvZBafn_u4ZZyHknP_XIzKYPLcN8TzQggQQYcqlu4_NEGmRC0s6f11Xe6T0dIlq3hnqIo6SstYnPNL-2Gagvi8Fo')",
                    }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 ${theme.bgGradientStart} mix-blend-multiply transition-colors duration-500`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradientEnd} to-background-dark/90 mix-blend-multiply transition-colors duration-500`}></div>
                </div>

                {/* Logo Area (Overlay) */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${theme.bgMedium} ${theme.primaryText} backdrop-blur-md border ${theme.primaryBorder} transition-colors duration-500`}>
                        <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                        {isTeacher ? 'UniTwin Educator' : 'Student Digital Twin'}
                    </h2>
                </div>

                {/* Hero Text Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg transition-all duration-500">
                        {isTeacher ? 'Guiding Success.' : 'Predicting Success.'}
                        <br />
                        <span className="text-white/90 transition-colors duration-500">
                            {isTeacher ? 'Empowering Students.' : 'Empowering Futures.'}
                        </span>
                    </h1>
                    <p className="text-lg leading-relaxed text-slate-200 drop-shadow-md">
                        {isTeacher
                            ? "Leverage AI-driven insights to monitor student performance, predict risks, and provide timely interventions. The Educator platform gives you the tools to guide every student to success."
                            : "Unlock your academic potential with our AI-driven insights. The Student Digital Twin platform creates a personalized roadmap to help you navigate your university journey."
                        }
                    </p>

                    <div className="mt-10 flex gap-4">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10">
                            <span className={`material-symbols-outlined ${theme.primaryText} text-[20px] transition-colors duration-500`}>
                                {isTeacher ? 'monitoring' : 'analytics'}
                            </span>
                            <span className="text-sm font-medium text-white">
                                {isTeacher ? 'Performance Tracking' : 'Risk Prediction'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10">
                            <span className={`material-symbols-outlined ${theme.primaryText} text-[20px] transition-colors duration-500`}>
                                {isTeacher ? 'groups' : 'psychology'}
                            </span>
                            <span className="text-sm font-medium text-white">
                                {isTeacher ? 'Cohort Insights' : 'Personalized AI'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Copyright Footer on Image Side */}
                <div className="relative z-10 text-xs font-medium text-slate-400">
                    © 2024 Academic Risk Prediction Initiative. All rights reserved.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex w-full flex-col justify-center bg-background-light px-6 py-12 lg:w-1/2 lg:px-20 xl:w-5/12 xl:px-32">
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="mb-10 flex items-center gap-3 lg:hidden">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${theme.bgLight} ${theme.primaryText} transition-colors duration-500`}>
                        <span className="material-symbols-outlined text-[24px]">
                            school
                        </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {isTeacher ? 'UniTwin Educator' : 'Student Digital Twin'}
                    </h2>
                </div>

                <div className="mx-auto w-full max-w-[480px]">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    {/* Role Toggle Switch */}
                    <div className="mb-8 flex rounded-xl bg-slate-200/50 p-1 shadow-inner">
                        <button
                            onClick={() => setRole('STUDENT')}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${!isTeacher
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Student
                        </button>
                        <button
                            onClick={() => setRole('TEACHER')}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${isTeacher
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">school</span>
                            Teacher
                        </button>
                    </div>

                    {/* We pass the theme down to the login form to override the primary colors */}
                    <div data-role={role} className="transition-colors duration-500">
                        <LoginForm themeClasses={theme} emailPlaceholder={isTeacher ? "educator@university.edu" : "student@university.edu"} />
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <a
                            href="/register"
                            className={`font-bold ${theme.primaryText} ${theme.primaryTextHover} hover:underline transition-colors duration-300`}
                        >
                            Sign Up
                        </a>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex justify-center gap-6 text-xs text-slate-400">
                        <a href="#" className="hover:text-slate-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-slate-600 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
