import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { REFUND_DOCUMENT } from '@/data/legalDocuments';
import { REFUND_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: REFUND_SEO.description,
};

export default function Page() {
  return <LegalPageShell document={REFUND_DOCUMENT} seo={REFUND_SEO} />;
}
