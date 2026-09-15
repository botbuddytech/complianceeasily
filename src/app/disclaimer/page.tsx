import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { DISCLAIMER_DOCUMENT } from '@/data/legalDocuments';
import { DISCLAIMER_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: DISCLAIMER_SEO.description,
};

export default function Page() {
  return <LegalPageShell document={DISCLAIMER_DOCUMENT} seo={DISCLAIMER_SEO} />;
}
