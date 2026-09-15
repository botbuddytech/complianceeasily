import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { TERMS_DOCUMENT } from '@/data/legalDocuments';
import { TERMS_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: TERMS_SEO.description,
};

export default function Page() {
  return <LegalPageShell document={TERMS_DOCUMENT} seo={TERMS_SEO} />;
}
