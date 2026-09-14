import { useEffect } from 'react';
import {
  PageSeo,
  applyPageSeo,
  applyLandingJsonLd,
  clearLandingJsonLd,
} from '../lib/seo';

interface SeoProps {
  page: PageSeo;
  /** When set, injects FAQPage + org/software JSON-LD (landing only) */
  faqs?: { question: string; answer: string }[];
}

/**
 * Client-side document head manager for SPA routes.
 * Initial HTML in index.html covers first paint / non-JS crawlers.
 */
export function Seo({ page, faqs }: SeoProps) {
  useEffect(() => {
    applyPageSeo(page);
    if (faqs?.length) {
      applyLandingJsonLd(faqs);
    } else {
      clearLandingJsonLd();
    }
  }, [page, faqs]);

  return null;
}
