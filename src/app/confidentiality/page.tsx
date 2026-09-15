import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { CONFIDENTIALITY_DOCUMENT } from '@/data/legalDocuments';
import { CONFIDENTIALITY_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Confidentiality Policy',
  description: CONFIDENTIALITY_SEO.description,
};

export default function Page() {
  return <LegalPageShell document={CONFIDENTIALITY_DOCUMENT} seo={CONFIDENTIALITY_SEO} />;
}
