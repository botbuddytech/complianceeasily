import type { Metadata } from 'next';
import { AboutPage } from '@/views/AboutPage';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'About ComplianceEasily — AI speed with regulated professional accountability for Indian business compliance, WhatsApp reminders, and verified filings.',
};

export default function Page() {
  return <AboutPage />;
}
