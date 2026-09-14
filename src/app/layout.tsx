import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ComplianceEasily — AI Business Compliance for India',
    template: '%s | ComplianceEasily',
  },
  description:
    'Identify GST, MCA, tax, labour and State compliances for your Indian business. Free WhatsApp due-date alerts and professionally verified filings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF7F2] text-[#241A14] font-sans antialiased selection:bg-[#E8DCC9] selection:text-[#3B2314]">
        {children}
      </body>
    </html>
  );
}
