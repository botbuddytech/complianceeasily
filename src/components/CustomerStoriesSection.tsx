'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { Section } from './ui/Section';
import { Reveal, RevealGroup } from './ui/Reveal';

type Story = {
  id: string;
  title: string;
  tag: string;
  /** Optional YouTube video id — opens in lightbox when present */
  youtubeId?: string;
  image: string;
  imageAlt: string;
  /** First “founder stories” style card with overlay wordmark */
  featured?: boolean;
  featuredLabel?: string;
};

const STORIES: Story[] = [
  {
    id: 'founder-stories',
    title: 'How SpiceRoute Foods stays GST-ready every month',
    tag: 'Customer story',
    image:
      'https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Founder reviewing business documents in a café',
    featured: true,
    featuredLabel: 'Founder stories',
  },
  {
    id: 'chennai-kulfi',
    title: 'Chennai Kulfi — scaling a beloved brand without missing filings',
    tag: 'Customer story',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Founder portrait in business attire',
  },
  {
    id: 'rock-enterprises',
    title: 'Rock Enterprises — entrepreneurial growth with MCA on track',
    tag: 'Customer story',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Entrepreneur in a suit looking at camera',
  },
  {
    id: 'iceil-systems',
    title: 'Iceil Systems — multi-state labour & tax, one WhatsApp radar',
    tag: 'Customer story',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Founder in a branded polo speaking to camera',
  },
];

function StoryCard({
  story,
  onPlay,
}: {
  story: Story;
  onPlay: (story: Story) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(story)}
      className="group relative isolate flex aspect-[3/4] w-full min-w-[240px] sm:min-w-0 overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89E6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12161B]"
      aria-label={`Play customer story: ${story.title}`}
    >
      <Image
        src={story.image}
        alt={story.imageAlt}
        fill
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {story.featured && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C6570]/55 via-[#1E2630]/45 to-[#0E1217]/80" />
      )}
      {!story.featured && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1217]/90 via-[#0E1217]/25 to-transparent" />
      )}

      {story.featured && story.featuredLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display text-center text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-white/95 leading-tight px-4">
            {story.featuredLabel.split(' ').map((word, i) => (
              <span key={word} className={i === 0 ? 'block font-bold' : 'block font-normal italic text-white/85'}>
                {word}
              </span>
            ))}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 flex justify-end p-3 sm:p-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#0E1217] shadow-sm opacity-95 transition-transform duration-200 group-hover:scale-110">
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 space-y-1.5">
        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-white/80">
          {story.tag}
        </div>
        <div className="font-display text-[0.95rem] sm:text-base font-semibold text-white leading-snug">
          {story.title}
        </div>
      </div>
    </button>
  );
}

function VideoLightbox({
  story,
  onClose,
}: {
  story: Story;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0E1217]/70 backdrop-blur-sm"
        aria-label="Close video"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#D5D0C6] bg-[#0E1217] shadow-[0_24px_80px_-24px_rgba(14,18,23,0.65)]">
        <div className="flex items-start justify-between gap-4 px-4 py-3 sm:px-5 border-b border-[#1E2630]">
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#B89E6B]">
              Customer story
            </div>
            <h3 id={titleId} className="font-display text-sm sm:text-base font-semibold text-white truncate">
              {story.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E2630] text-[#A8B0BA] hover:text-white hover:bg-[#2A3340] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative aspect-video bg-black">
          {story.youtubeId ? (
            <iframe
              title={story.title}
              src={`https://www.youtube.com/embed/${story.youtubeId}?autoplay=1&rel=0`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0">
              <Image
                src={story.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#0E1217]">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </span>
                <p className="text-sm font-semibold text-white">Full video coming soon</p>
                <p className="text-xs text-[#A8B0BA] max-w-sm leading-relaxed">{story.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerStoriesSection() {
  const [active, setActive] = useState<Story | null>(null);

  return (
    <Section tone="espresso" withGrid withGlow id="customer-stories" className="!py-12 sm:!py-16 lg:!py-20">
      <div className="space-y-8 sm:space-y-10">
        <Reveal className="text-left max-w-3xl space-y-2.5">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#A8B0BA]">
            Customer stories
          </div>
          <h2 className="font-display text-[1.5rem] sm:text-3xl lg:text-[2.15rem] font-semibold tracking-tight text-white leading-[1.2]">
            Watch how founders stay compliant with ComplianceEasily
          </h2>
        </Reveal>

        <RevealGroup
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 snap-x snap-mandatory"
          stagger={0.07}
        >
          {STORIES.map((story) => (
            <div key={story.id} className="snap-start shrink-0 w-[78%] max-w-[300px] sm:w-auto sm:max-w-none">
              <StoryCard story={story} onPlay={setActive} />
            </div>
          ))}
        </RevealGroup>
      </div>

      {active && <VideoLightbox story={active} onClose={() => setActive(null)} />}
    </Section>
  );
}
