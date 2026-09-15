import { ExternalLink, ShieldCheck, FileText, Search, Scale, ArrowRight } from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

export function EcosystemSection() {
  const platforms = [
    {
      name: 'ContractEasily',
      tagline: 'AI Contract Drafting & Review',
      description: 'Draft, redline, analyze, and sign commercial contracts with speed and legal rigor.',
      url: 'https://www.contracteasily.com',
      badge: 'Live',
      badgeColor: 'bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B]',
      icon: FileText,
    },
    {
      name: 'FindCasesEasily',
      tagline: 'Court Judgment & Case Intelligence',
      description: 'AI semantic search across millions of High Court and Supreme Court of India precedents.',
      url: 'https://www.findcaseseasily.com',
      badge: 'Live',
      badgeColor: 'bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B]',
      icon: Search,
    },
    {
      name: 'ComplianceEasily',
      tagline: 'Business Compliance & WhatsApp Radar',
      description: 'End-to-end statutory roadmaps, automated WhatsApp due-date reminders, and professional execution.',
      url: '#',
      badge: 'Current Platform',
      badgeColor: 'bg-[#B89E6B] text-white font-bold',
      icon: ShieldCheck,
      featured: true,
    },
    {
      name: 'LitigationEasily',
      tagline: 'Disputes & Courtroom Workflow',
      description: 'Case stage management, cause list tracking, and legal notice escalation across Indian tribunals.',
      url: '#',
      badge: 'Coming Soon',
      badgeColor: 'bg-[#F4F2EE] border border-[#D5D0C6] text-[#6B7580] font-mono',
      icon: Scale,
      muted: true,
    },
  ];

  return (
    <Section tone="cream" withGrid className="space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <span className="text-[10px] font-bold tracking-widest uppercase font-mono">
              THE EASILY LEGAL &amp; REGULATORY SUITE
            </span>
          }
          title={
            <>
              Integrated tools for the <br />
              <span className="text-[#B89E6B]">modern Indian enterprise.</span>
            </>
          }
          description="ComplianceEasily is part of the Easily platform ecosystem, empowering Indian founders, CAs, and advocates with specialized legal and statutory automation tools."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((p) => {
          const Icon = p.icon;
          const isExternal = p.url.startsWith('http');

          const cardInner = (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#0E1217] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#B89E6B]" />
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-base font-semibold text-[#0E1217] flex items-center">
                    {p.name}
                    {isExternal && (
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-[#6B7580] group-hover:text-[#0E1217]" />
                    )}
                  </h3>
                  <div className="text-xs font-semibold text-[#B89E6B] mt-0.5 font-mono">{p.tagline}</div>
                </div>

                <p className="text-xs text-[#5C6570] leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#D5D0C6] flex items-center justify-between text-xs font-mono font-bold text-[#6B7580] group-hover:text-[#B89E6B] uppercase tracking-wider">
                <span>{isExternal ? 'Visit Website' : 'Explore'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </>
          );

          if (p.featured) {
            return (
              <Card
                key={p.name}
                featured
                hover={false}
                className="group flex flex-col justify-between text-left"
              >
                {cardInner}
              </Card>
            );
          }

          return (
            <Card
              key={p.name}
              as="a"
              href={p.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              className={`group flex flex-col justify-between text-left ${p.muted ? 'opacity-80' : ''}`}
            >
              {cardInner}
            </Card>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
