import { useState } from 'react';
import {
  Check,
  Shield,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Info,
} from 'lucide-react';
import { PRICING_PLANS } from '../data/pricing';
import { PricingTransparencyCallout } from './PricingTransparencyCallout';
import { ServicePricingTable } from './ServicePricingTable';
import { VerifiedBadge } from './VerifiedBadge';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface PricingSectionProps {
  onOpenChecker: () => void;
  onOpenProtectionModal: () => void;
}

export function PricingSection({ onOpenChecker, onOpenProtectionModal }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <Section tone="espresso" withGrid withGlow id="pricing">
      <div className="space-y-14">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                TRANSPARENT PLANS &amp; PRICING
              </span>
            </>
          }
          title={
            <>
              Simple, honest pricing. <br />
              <span className="text-[#B89E6B]">Start free. Upgrade as you scale.</span>
            </>
          }
          description="Free forever for basic WhatsApp reminders. Zero hidden markups on statutory challans, and full professional review when you need it."
        />

        <div className="flex items-center justify-center space-x-3 pt-6 font-mono">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              billingPeriod === 'monthly' ? 'text-white' : 'text-[#8B95A1]'
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#E4E0D8] transition-colors duration-200 ease-in-out focus:outline-hidden"
            role="switch"
            aria-checked={billingPeriod === 'annual'}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F4F2EE] shadow-xs ring-0 transition duration-200 ease-in-out ${
                billingPeriod === 'annual' ? 'translate-x-5 bg-[#B89E6B]' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-xs font-bold uppercase tracking-wider flex items-center ${
              billingPeriod === 'annual' ? 'text-[#B89E6B]' : 'text-[#8B95A1]'
            }`}
          >
            <span>Annual</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[9px] bg-[#1E2630] border border-[#1E2630] text-[#B89E6B] font-bold uppercase tracking-widest">
              Save 20%
            </span>
          </span>
        </div>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {PRICING_PLANS.map((plan) => {
          const isFeatured = plan.id === 'pro';
          const isFree = plan.price === 0;

          const displayPrice =
            isFree
              ? '₹0'
              : billingPeriod === 'annual'
              ? `₹${Math.round(plan.price * 0.8).toLocaleString('en-IN')}`
              : `₹${plan.price.toLocaleString('en-IN')}`;

          const planContent = (
            <>
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3.5 py-0.5 rounded-full bg-[#B89E6B] text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest shadow-2xs flex items-center space-x-1 border border-[#8A7349] z-10 whitespace-nowrap max-w-[calc(100%-1rem)]">
                  <Shield className="w-3 h-3 text-[#F4F2EE] shrink-0" />
                  <span className="truncate">Includes Compliance Protection</span>
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#0E1217] tracking-tight leading-[1.15]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#6B7580] font-medium mt-1">{plan.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {plan.id === 'pro' && (
                      <>
                        <VerifiedBadge variant="bank" />
                        <VerifiedBadge variant="integration" />
                      </>
                    )}
                    {plan.id === 'managed' && (
                      <>
                        <VerifiedBadge variant="ca" />
                        <VerifiedBadge variant="standards" />
                        <VerifiedBadge variant="professional" />
                      </>
                    )}
                  </div>
                </div>

                <div className="pb-4 border-b border-[#D5D0C6]">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-[#0E1217] tracking-tight font-mono">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-[#6B7580] font-mono">/{plan.period}</span>
                  </div>
                  {billingPeriod === 'annual' && !isFree && (
                    <div className="text-[10px] font-mono text-[#B89E6B] font-semibold mt-1">
                      Billed annually (₹{(Math.round(plan.price * 0.8) * 12).toLocaleString('en-IN')}/year)
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-[#0E1217] uppercase tracking-widest font-mono">
                    Included in {plan.name}:
                  </div>
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start text-xs text-[#5C6570] leading-snug">
                      <Check className="w-3.5 h-3.5 text-[#B89E6B] mr-2 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 space-y-3 font-mono">
                <button
                  type="button"
                  onClick={onOpenChecker}
                  className={`w-full py-3.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xs transition-all flex items-center justify-center space-x-2 ${
                    isFeatured
                      ? 'btn-primary shadow-sm'
                      : isFree
                      ? 'bg-[#0E1217] hover:bg-[#0E1217] text-white'
                      : 'bg-[#F7F5F1] hover:bg-[#EBE8E2] text-[#B89E6B]'
                  }`}
                >
                  {isFree && <MessageSquare className="w-3.5 h-3.5" />}
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isFeatured && (
                  <button
                    type="button"
                    onClick={onOpenProtectionModal}
                    className="w-full text-center text-[10px] font-mono font-semibold text-[#B89E6B] hover:underline flex items-center justify-center space-x-1 uppercase tracking-wider"
                  >
                    <Info className="w-3 h-3" />
                    <span>View Guarantee Coverage Terms</span>
                  </button>
                )}
              </div>
            </>
          );

          if (isFeatured) {
            return (
              <Card
                key={plan.id}
                featured
                hover={false}
                className="relative flex flex-col justify-between text-left p-7 sm:p-8 pt-8"
              >
                {planContent}
              </Card>
            );
          }

          return (
            <Card
              key={plan.id}
              hover
              className="relative flex flex-col justify-between text-left p-7 sm:p-8"
            >
              {planContent}
            </Card>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.05}>
        <PricingTransparencyCallout />
      </Reveal>

      <Reveal delay={0.1}>
        <ServicePricingTable onOpenChecker={onOpenChecker} />
      </Reveal>
      </div>
    </Section>
  );
}
