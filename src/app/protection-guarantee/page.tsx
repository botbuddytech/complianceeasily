import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { PROTECTION_GUARANTEE_DOCUMENT } from '@/data/legalDocuments';
import { PROTECTION_GUARANTEE_SEO } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Compliance Protection Guarantee Scheme',
  description: PROTECTION_GUARANTEE_SEO.description,
};

export default function Page() {
  return (
    <LegalPageShell document={PROTECTION_GUARANTEE_DOCUMENT} seo={PROTECTION_GUARANTEE_SEO} />
  );
}
