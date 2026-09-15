import type { Metadata } from 'next';
import { SignupPage } from '@/views/SignupPage';

export const metadata: Metadata = {
  title: 'Create account',
  description:
    'Create a free ComplianceEasily account. Get WhatsApp compliance reminders for one Indian business entity forever.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SignupPage />;
}
