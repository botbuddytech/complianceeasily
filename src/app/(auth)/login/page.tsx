import type { Metadata } from 'next';
import { LoginPage } from '@/views/LoginPage';

export const metadata: Metadata = {
  title: 'Log in',
  description:
    'Sign in to your ComplianceEasily workspace to manage compliance passports, WhatsApp alerts and filings.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPage />;
}
