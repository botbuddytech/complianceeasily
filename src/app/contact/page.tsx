import type { Metadata } from 'next';
import { ContactPage } from '@/views/ContactPage';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Contact ComplianceEasily for sales, onboarding, professional network, and support. WhatsApp, email, and phone — Indian business compliance desk.',
};

export default function Page() {
  return <ContactPage />;
}
