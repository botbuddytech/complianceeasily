import fs from 'fs';
import path from 'path';

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('wrote', file);
}

function page(name, from) {
  return `'use client';\n\nimport { ${name} } from '${from}';\n\nexport default function Page() {\n  return <${name} />;\n}\n`;
}

const clientPages = [
  ['overview', 'UserOverviewPage', '@/views/dashboard/OverviewPage'],
  ['entities', 'EntitiesPage', '@/views/dashboard/EntitiesPage'],
  ['filings', 'FilingsPage', '@/views/dashboard/FilingsPage'],
  ['documents', 'DocumentsPage', '@/views/dashboard/DocumentsPage'],
  ['notifications', 'NotificationsPage', '@/views/dashboard/NotificationsPage'],
  ['billing', 'BillingPage', '@/views/dashboard/BillingPage'],
  ['team', 'TeamPage', '@/views/dashboard/TeamPage'],
  ['protection', 'ProtectionPage', '@/views/dashboard/ProtectionPage'],
  ['settings', 'SettingsPage', '@/views/dashboard/SettingsPage'],
  ['support', 'UserSupportPage', '@/views/dashboard/SupportPage'],
];

const booksPages = [
  ['overview', 'BookkeepingOverviewPage', '@/views/dashboard/bookkeeping/OverviewPage'],
  ['connections', 'BookkeepingConnectionsPage', '@/views/dashboard/bookkeeping/ConnectionsPage'],
  ['integrations', 'BookkeepingIntegrationsPage', '@/views/dashboard/bookkeeping/IntegrationsPage'],
  ['ledgers', 'BookkeepingLedgersPage', '@/views/dashboard/bookkeeping/LedgersPage'],
  ['transactions', 'BookkeepingTransactionsPage', '@/views/dashboard/bookkeeping/TransactionsPage'],
  ['gst', 'BookkeepingGstPage', '@/views/dashboard/bookkeeping/GstPage'],
  ['tds', 'BookkeepingTdsPage', '@/views/dashboard/bookkeeping/TdsPage'],
  ['income-tax', 'BookkeepingIncomeTaxPage', '@/views/dashboard/bookkeeping/IncomeTaxPage'],
  ['profit-loss', 'BookkeepingProfitLossPage', '@/views/dashboard/bookkeeping/ProfitLossPage'],
  ['balance-sheet', 'BookkeepingBalanceSheetPage', '@/views/dashboard/bookkeeping/BalanceSheetPage'],
  ['exports', 'BookkeepingExportsPage', '@/views/dashboard/bookkeeping/ExportsPage'],
];

const investPages = [
  ['overview', 'InvestmentsOverviewPage', '@/views/dashboard/investments/OverviewPage'],
  ['property', 'InvestmentsPropertyPage', '@/views/dashboard/investments/PropertyPage'],
  ['stocks', 'InvestmentsStocksPage', '@/views/dashboard/investments/StocksPage'],
  ['ledger', 'InvestmentsLedgerPage', '@/views/dashboard/investments/LedgerPage'],
  ['compliances', 'InvestmentsCompliancesPage', '@/views/dashboard/investments/CompliancesPage'],
];

const adminPages = [
  ['overview', 'AdminOverviewPage', '@/views/admin/OverviewPage'],
  ['compliance-triggers', 'ComplianceTriggersPage', '@/views/admin/ComplianceTriggersPage'],
  ['clients', 'ClientsPage', '@/views/admin/ClientsPage'],
  ['filing-queue', 'FilingsQueuePage', '@/views/admin/FilingsQueuePage'],
  ['professionals', 'ProfessionalsPage', '@/views/admin/ProfessionalsPage'],
  ['protection-claims', 'ProtectionClaimsPage', '@/views/admin/ProtectionClaimsPage'],
  ['catalogue', 'CataloguePage', '@/views/admin/CataloguePage'],
  ['users', 'UsersPage', '@/views/admin/UsersPage'],
  ['support', 'AdminSupportPage', '@/views/admin/SupportPage'],
];

const proPages = [
  ['overview', 'ProfessionalOverviewPage', '@/views/professional/OverviewPage'],
  ['queue', 'ProfessionalQueuePage', '@/views/professional/QueuePage'],
  ['document-review', 'ProfessionalDocumentReviewPage', '@/views/professional/DocumentReviewPage'],
  ['clients', 'ProfessionalClientsPage', '@/views/professional/ClientsPage'],
  ['compliance-triggers', 'ProfessionalComplianceTriggersPage', '@/views/professional/ComplianceTriggersPage'],
  ['calendar', 'ProfessionalCalendarPage', '@/views/professional/CalendarPage'],
  ['earnings', 'ProfessionalEarningsPage', '@/views/professional/EarningsPage'],
  ['profile', 'ProfessionalProfilePage', '@/views/professional/ProfilePage'],
  ['support', 'ProfessionalSupportPage', '@/views/professional/SupportPage'],
];

const proBooks = [
  ['overview', 'ProfessionalBooksOverviewPage', '@/views/professional/books/OverviewPage'],
  ['integrations', 'ProfessionalBooksIntegrationsPage', '@/views/professional/books/IntegrationsPage'],
  ['ledgers', 'ProfessionalBooksLedgersPage', '@/views/professional/books/LedgersPage'],
  ['transactions', 'ProfessionalBooksTransactionsPage', '@/views/professional/books/TransactionsPage'],
  ['gst', 'ProfessionalBooksGstPage', '@/views/professional/books/GstPage'],
  ['tds', 'ProfessionalBooksTdsPage', '@/views/professional/books/TdsPage'],
  ['income-tax', 'ProfessionalBooksIncomeTaxPage', '@/views/professional/books/IncomeTaxPage'],
  ['profit-loss', 'ProfessionalBooksProfitLossPage', '@/views/professional/books/ProfitLossPage'],
  ['balance-sheet', 'ProfessionalBooksBalanceSheetPage', '@/views/professional/books/BalanceSheetPage'],
];

const proInvest = [
  ['overview', 'ProfessionalInvestmentsOverviewPage', '@/views/professional/investments/OverviewPage'],
  ['property', 'ProfessionalInvestmentsPropertyPage', '@/views/professional/investments/PropertyPage'],
  ['stocks', 'ProfessionalInvestmentsStocksPage', '@/views/professional/investments/StocksPage'],
  ['ledger', 'ProfessionalInvestmentsLedgerPage', '@/views/professional/investments/LedgerPage'],
  ['compliances', 'ProfessionalInvestmentsCompliancesPage', '@/views/professional/investments/CompliancesPage'],
];

for (const [slug, name, from] of clientPages) {
  write(`src/app/dashboard/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/dashboard/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/dashboard/overview'); }\n",
);

for (const [slug, name, from] of booksPages) {
  write(`src/app/dashboard/bookkeeping/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/dashboard/bookkeeping/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/dashboard/bookkeeping/overview'); }\n",
);
write(
  'src/app/dashboard/bookkeeping/layout.tsx',
  `'use client';\nimport { BookkeepingLayout } from '@/views/dashboard/bookkeeping/BookkeepingLayout';\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <BookkeepingLayout>{children}</BookkeepingLayout>;\n}\n`,
);

for (const [slug, name, from] of investPages) {
  write(`src/app/dashboard/investments/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/dashboard/investments/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/dashboard/investments/overview'); }\n",
);
write(
  'src/app/dashboard/investments/layout.tsx',
  `'use client';\nimport { InvestmentsLayout } from '@/views/dashboard/investments/InvestmentsLayout';\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <InvestmentsLayout>{children}</InvestmentsLayout>;\n}\n`,
);

for (const [slug, name, from] of adminPages) {
  write(`src/app/admin/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/admin/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/admin/overview'); }\n",
);

for (const [slug, name, from] of proPages) {
  write(`src/app/professional/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/professional/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/professional/overview'); }\n",
);

for (const [slug, name, from] of proBooks) {
  write(`src/app/professional/books/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/professional/books/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/professional/books/overview'); }\n",
);
write(
  'src/app/professional/books/layout.tsx',
  `'use client';\nimport { ProfessionalBooksLayout } from '@/views/professional/books/BooksLayout';\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <ProfessionalBooksLayout>{children}</ProfessionalBooksLayout>;\n}\n`,
);

for (const [slug, name, from] of proInvest) {
  write(`src/app/professional/investments/${slug}/page.tsx`, page(name, from));
}
write(
  'src/app/professional/investments/page.tsx',
  "import { redirect } from 'next/navigation';\nexport default function Page() { redirect('/professional/investments/overview'); }\n",
);
write(
  'src/app/professional/investments/layout.tsx',
  `'use client';\nimport { ProfessionalInvestmentsLayout } from '@/views/professional/investments/InvestmentsLayout';\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <ProfessionalInvestmentsLayout>{children}</ProfessionalInvestmentsLayout>;\n}\n`,
);

console.log('done');
