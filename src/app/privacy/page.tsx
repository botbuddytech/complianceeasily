import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { PRIVACY_DOCUMENT } from '@/data/legalDocuments';
import { PRIVACY_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: PRIVACY_SEO.description,
};

export default function Page() {
  return <LegalPageShell document={PRIVACY_DOCUMENT} seo={PRIVACY_SEO} />;
}
