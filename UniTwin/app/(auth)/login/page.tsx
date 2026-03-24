import LoginView from '@/components/auth/LoginView';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - UniTwin',
    description: 'Access your University dashboard.',
};

export default function LoginPage() {
    return <LoginView />;
}
