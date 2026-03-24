import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register - Student Digital Twin',
    description: 'Create your account.',
};

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* Left Side: Image / Hero (Reused) */}
            <div className="relative hidden w-full lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between bg-surface-dark p-12 overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhNiEb75xlpmX6gf8r7bbJSdvMPgNX0yaDKq79GM1NnHdYDJEOzco6T2hF70BIPw9d8BxYQ_CDOlzsymQMBP6hsxC-oQxAJzGatucJs9O1zW0Q_cADUhXf8Guou077vZH4aGuDVnqZmRwnC0SvROeojD2bok1nH0IavcvJcLLZcIcwVgTWXwPVvZBafn_u4ZZyHknP_XIzKYPLcN8TzQggQQYcqlu4_NEGmRC0s6f11Xe6T0dIlq3hnqIo6SstYnPNL-2Gagvi8Fo')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-primary/20 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background-dark/90 mix-blend-multiply"></div>
                </div>

                {/* Logo Area (Overlay) */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary backdrop-blur-md border border-primary/20">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                        Student Digital Twin
                    </h2>
                </div>

                {/* Hero Text Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
                        Join the Future.
                        <br />
                        <span className="text-primary/90">Predict Your Success.</span>
                    </h1>
                    <p className="text-lg leading-relaxed text-slate-200 drop-shadow-md">
                        Create an account to start your personalized academic journey.
                    </p>
                </div>

                {/* Copyright Footer on Image Side */}
                <div className="relative z-10 text-xs font-medium text-slate-400">
                    © 2024 Academic Risk Prediction Initiative. All rights reserved.
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="flex w-full flex-col justify-center bg-background-light px-6 py-12 lg:w-1/2 lg:px-20 xl:w-5/12 xl:px-32">
                <div className="mx-auto w-full max-w-[480px]">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Create Account
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Enter your details to get started.
                        </p>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="font-bold text-primary hover:text-primary/80 hover:underline"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
