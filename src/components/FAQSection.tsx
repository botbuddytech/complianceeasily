import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FAQS_DATA } from '../data/faqs';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { Card } from './ui/Card';

interface FAQSectionProps {
  onOpenChecker: () => void;
}

export function FAQSection({ onOpenChecker }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const prefersReduced = useReducedMotion();

  const categories = ['All', 'General', 'Accounting', 'Pricing', 'Protection', 'AI & Workflow', 'Professionals', 'Legal & Applicability'];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    return matchesCat;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section tone="cream" id="faq">
      <div className="max-w-4xl mx-auto space-y-12">
        <Reveal>
          <SectionHeader
            eyebrow={
              <>
                <HelpCircle className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                  KNOWLEDGE BASE &amp; FAQS
                </span>
              </>
            }
            title={
              <>
                Everything you need to know <br />
                <span className="text-[#B89E6B]">about ComplianceEasily.</span>
              </>
            }
            description="Clear answers about our AI workflow engine, our vetted network of qualified professionals, and our Compliance Protection Guarantee."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'bg-[#FFFFFF] border border-[#D5D0C6] text-[#5C6570] hover:bg-[#F4F2EE]'
                  }`}
                >
                  {isActive && !prefersReduced && (
                    <motion.span
                      layoutId="faq-filter-pill"
                      className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && prefersReduced && (
                    <span className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="space-y-3 text-left">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={Math.min(index * 0.03, 0.2)}>
                <Card hover={false} className="overflow-hidden p-0">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#EBE8E2]/70 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                  >
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#0E1217] tracking-tight">
                      {faq.question}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'bg-[#EBE8E2] text-[#B89E6B] rotate-180' : 'bg-[#EBE8E2] text-[#6B7580]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5C6570] leading-relaxed border-t border-[#D5D0C6]"
                    >
                      <p>{faq.answer}</p>
                      <div className="mt-3 flex items-center space-x-2 text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider">
                        <span>Category: {faq.category}</span>
                      </div>
                    </div>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <Card hover={false} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-display text-sm font-semibold text-[#0E1217] tracking-tight">
                Still have questions regarding your specific entity?
              </h4>
              <p className="text-xs text-[#5C6570]">
                Our compliance specialists are available on WhatsApp to review your business facts.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenChecker}
              className="btn-primary inline-flex items-center space-x-2 font-mono font-bold text-xs uppercase tracking-wider shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
