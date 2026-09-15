/** Central SEO / site identity config for ComplianceEasily */

export const SITE = {
  name: 'ComplianceEasily',
  legalName: 'ComplianceEasily',
  url: 'https://www.complianceeasily.com',
  locale: 'en_IN',
  language: 'en-IN',
  twitterHandle: '@ComplianceEasily',
  themeColor: '#B89E6B',
  ogImage: '/og-image.svg',
  supportEmail: 'hello@complianceeasily.com',
} as const;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Default true for marketing pages; auth pages should be noindex */
  index?: boolean;
  ogType?: 'website' | 'article';
  keywords?: string[];
};

export const LANDING_SEO: PageSeo = {
  title: 'ComplianceEasily — AI Business Compliance for India | Free WhatsApp Reminders',
  description:
    'Identify GST, MCA, tax, labour and State compliances for your Indian business. Free WhatsApp due-date alerts, a Business Compliance Passport, and filings reviewed by practising CAs, CSs and Advocates.',
  path: '/',
  index: true,
  keywords: [
    'business compliance India',
    'GST filing reminders',
    'MCA compliance',
    'WhatsApp compliance alerts',
    'Chartered Accountant filing',
    'Company Secretary ROC',
    'Business Compliance Passport',
    'GSTR-3B due date',
    'AI compliance software India',
  ],
};

export const LOGIN_SEO: PageSeo = {
  title: 'Log in — ComplianceEasily',
  description: 'Sign in to your ComplianceEasily workspace to manage compliance passports, WhatsApp alerts and filings.',
  path: '/login',
  index: false,
};

export const SIGNUP_SEO: PageSeo = {
  title: 'Create account — ComplianceEasily',
  description:
    'Create a free ComplianceEasily account. Get WhatsApp compliance reminders for one Indian business entity forever.',
  path: '/signup',
  index: false,
};

export const CONTACT_SEO: PageSeo = {
  title: 'Contact us — ComplianceEasily',
  description:
    'Contact ComplianceEasily for sales, onboarding, professional network enquiries, and support. WhatsApp, email, and phone — response within one business day.',
  path: '/contact',
  index: true,
  keywords: [
    'contact ComplianceEasily',
    'compliance support India',
    'GST filing help',
    'talk to CA CS advocate',
  ],
};

export const ABOUT_SEO: PageSeo = {
  title: 'About us — ComplianceEasily',
  description:
    'Learn how ComplianceEasily combines AI monitoring with practising CAs, CSs and Advocates to keep Indian businesses compliant — WhatsApp-first, transparent, and accountable.',
  path: '/about',
  index: true,
  keywords: [
    'about ComplianceEasily',
    'AI business compliance India',
    'professional accountability',
    'WhatsApp compliance reminders',
  ],
};

export const TERMS_SEO: PageSeo = {
  title: 'Terms & Conditions — ComplianceEasily',
  description:
    'Terms & Conditions for using ComplianceEasily — platform access, fees, client duties, liability limits and governing law for Indian business compliance services.',
  path: '/terms',
  index: true,
};

export const PRIVACY_SEO: PageSeo = {
  title: 'Privacy Policy — ComplianceEasily',
  description:
    'Privacy Policy for ComplianceEasily — how we collect, use, store and share business and personal data for WhatsApp compliance workflows and professional filings.',
  path: '/privacy',
  index: true,
};

export const REFUND_SEO: PageSeo = {
  title: 'Refund Policy — ComplianceEasily',
  description:
    'Refund Policy for ComplianceEasily subscriptions, professional fees and government pass-through challans.',
  path: '/refund-policy',
  index: true,
};

export const CONFIDENTIALITY_SEO: PageSeo = {
  title: 'Confidentiality Policy — ComplianceEasily',
  description:
    'Confidentiality Policy for ComplianceEasily — how statutory, financial and business information is protected on the platform and with networked professionals.',
  path: '/confidentiality',
  index: true,
};

export const DISCLAIMER_SEO: PageSeo = {
  title: 'Disclaimer — ComplianceEasily',
  description:
    'Disclaimer for ComplianceEasily — limitations on legal/tax advice, AI outputs, compliance applicability and third-party government portals.',
  path: '/disclaimer',
  index: true,
};

export const PROTECTION_GUARANTEE_SEO: PageSeo = {
  title: 'Compliance Protection Guarantee Scheme — ComplianceEasily',
  description:
    'Compliance Protection Guarantee Scheme terms — eligible Managed-plan filings, client cut-offs, exclusions, claim process and reimbursement caps. Not an insurance policy.',
  path: '/protection-guarantee',
  index: true,
};

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p === '/' ? '' : p}`;
}

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string
): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function applyPageSeo(page: PageSeo): void {
  const title = page.title;
  const description = page.description;
  const url = absoluteUrl(page.path);
  const image = absoluteUrl(SITE.ogImage);
  const robots = page.index === false ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  document.title = title;
  document.documentElement.lang = SITE.language;

  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', robots);
  upsertMeta('name', 'googlebot', robots);
  if (page.keywords?.length) {
    upsertMeta('name', 'keywords', page.keywords.join(', '));
  }

  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', page.ogType || 'website');
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:site_name', SITE.name);
  upsertMeta('property', 'og:locale', SITE.locale);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);

  upsertLink('canonical', url);
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/brand/logo.png'),
    description: LANDING_SEO.description,
    email: SITE.supportEmail,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    sameAs: [
      'https://www.contracteasily.com',
      'https://www.findcaseseasily.com',
    ],
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: LANDING_SEO.description,
    inLanguage: SITE.language,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
    },
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE.url,
    description: LANDING_SEO.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free WhatsApp compliance reminders for one business entity',
    },
    featureList: [
      'Free WhatsApp statutory due-date reminders',
      'Business Compliance Passport',
      'GST, MCA, labour and State compliance mapping',
      'Professional review by CAs, CSs and Advocates',
    ],
    audience: {
      '@type': 'Audience',
      geographicArea: {
        '@type': 'Country',
        name: 'India',
      },
    },
  };
}

export function buildFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function applyLandingJsonLd(
  faqs: { question: string; answer: string }[]
): void {
  upsertJsonLd('seo-ld-organization', buildOrganizationJsonLd());
  upsertJsonLd('seo-ld-website', buildWebsiteJsonLd());
  upsertJsonLd('seo-ld-software', buildSoftwareApplicationJsonLd());
  upsertJsonLd('seo-ld-faq', buildFaqJsonLd(faqs));
}

export function clearLandingJsonLd(): void {
  ['seo-ld-organization', 'seo-ld-website', 'seo-ld-software', 'seo-ld-faq'].forEach((id) => {
    document.getElementById(id)?.remove();
  });
}
