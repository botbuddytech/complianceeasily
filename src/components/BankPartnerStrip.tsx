/**
 * Stylised bank / email partner marks for the accounting integrations strip.
 * Brand colours approximate public identity systems for recognition on marketing UI.
 */

type PartnerMark = {
  id: string;
  label: string;
  short: string;
  fg: string;
  bg: string;
  border: string;
};

const BANK_PARTNERS: PartnerMark[] = [
  {
    id: 'hdfc',
    label: 'HDFC Bank',
    short: 'HDFC',
    fg: '#004C8F',
    bg: '#E8F1FA',
    border: '#B7D0E8',
  },
  {
    id: 'icici',
    label: 'ICICI Bank',
    short: 'ICICI',
    fg: '#F58220',
    bg: '#FFF4EB',
    border: '#F5C9A0',
  },
  {
    id: 'axis',
    label: 'Axis Bank',
    short: 'AXIS',
    fg: '#97144D',
    bg: '#F9E8EF',
    border: '#E0A8C0',
  },
  {
    id: 'sbi',
    label: 'State Bank of India',
    short: 'SBI',
    fg: '#1A3E8C',
    bg: '#E8EDF8',
    border: '#A8B8DE',
  },
  {
    id: 'kotak',
    label: 'Kotak Mahindra Bank',
    short: 'Kotak',
    fg: '#ED1C24',
    bg: '#FDECEC',
    border: '#F5B0B3',
  },
  {
    id: 'yes',
    label: 'Yes Bank',
    short: 'Yes',
    fg: '#00205B',
    bg: '#E6EBF5',
    border: '#9AADC8',
  },
  {
    id: 'idfc',
    label: 'IDFC FIRST Bank',
    short: 'IDFC',
    fg: '#9B1D20',
    bg: '#F8EAEA',
    border: '#D9A0A2',
  },
  {
    id: 'bob',
    label: 'Bank of Baroda',
    short: 'BoB',
    fg: '#F15A29',
    bg: '#FEF0EA',
    border: '#F5C0A8',
  },
];

const EMAIL_PARTNERS: PartnerMark[] = [
  {
    id: 'gmail',
    label: 'Gmail',
    short: 'Gmail',
    fg: '#EA4335',
    bg: '#FCECEB',
    border: '#F0B5AF',
  },
  {
    id: 'outlook',
    label: 'Outlook',
    short: 'Outlook',
    fg: '#0078D4',
    bg: '#E6F2FB',
    border: '#9BC7E8',
  },
];

function MarkChip({ mark }: { mark: PartnerMark }) {
  return (
    <div
      title={mark.label}
      className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 bg-[#FFFFFF] shadow-[0_1px_2px_rgba(14, 18, 23,0.05)]"
      style={{ borderColor: mark.border }}
    >
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black tracking-tight shrink-0"
        style={{ backgroundColor: mark.bg, color: mark.fg }}
        aria-hidden
      >
        {mark.short.slice(0, 2).toUpperCase()}
      </span>
      <span className="text-[11px] font-bold tracking-tight" style={{ color: mark.fg }}>
        {mark.short}
      </span>
    </div>
  );
}

/** Compact monogram tiles with brand colour — used in denser strips */
function MarkTile({ mark }: { mark: PartnerMark }) {
  return (
    <div
      title={mark.label}
      className="flex flex-col items-center justify-center gap-1 rounded-xl border bg-[#FFFFFF] px-2 py-2 min-h-[3.25rem] shadow-[0_1px_2px_rgba(14, 18, 23,0.05)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
      style={{ borderColor: mark.border }}
    >
      <BankGlyph id={mark.id} color={mark.fg} />
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: mark.fg }}>
        {mark.short}
      </span>
    </div>
  );
}

function BankGlyph({ id, color }: { id: string; color: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true as const,
  };

  switch (id) {
    case 'hdfc':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={color} />
          <path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'icici':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill={color} />
          <path
            d="M8 14.5c1.2-3 2.6-5 4-5s2.8 2 4 5"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="9" r="1.4" fill="#fff" />
        </svg>
      );
    case 'axis':
      return (
        <svg {...common}>
          <path d="M12 3l9 18H3L12 3z" fill={color} />
          <path d="M12 9.5v5.5M9.5 15h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'sbi':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <circle cx="12" cy="12" r="3.2" fill={color} />
        </svg>
      );
    case 'kotak':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" fill={color} />
          <path d="M8 8v8M8 12h4.5L16 16M12.5 12L16 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'yes':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="3" fill={color} />
          <path d="M7 9l2.5 3.5L17 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'idfc':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" fill={color} />
          <text x="12" y="15.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui,sans-serif">
            1st
          </text>
        </svg>
      );
    case 'bob':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill={color} />
          <path d="M8 13c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" stroke="#fff" strokeWidth="1.6" />
          <circle cx="12" cy="9" r="1.2" fill="#fff" />
        </svg>
      );
    case 'gmail':
      return (
        <svg {...common}>
          <path
            d="M4 7.5L12 13l8-5.5V17a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17V7.5z"
            fill={color}
            opacity="0.9"
          />
          <path d="M4 7.5L12 13l8-5.5L12 4 4 7.5z" fill={color} />
        </svg>
      );
    case 'outlook':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="14" height="14" rx="2" fill={color} />
          <circle cx="17" cy="12" r="4" fill="#50A8E8" stroke="#fff" strokeWidth="1" />
          <path d="M6 10.5h8M6 13.5h5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" fill={color} />
        </svg>
      );
  }
}

interface BankPartnerStripProps {
  compact?: boolean;
}

export function BankPartnerStrip({ compact = false }: BankPartnerStripProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7580]">
          Connected banks
        </div>
        <div className="flex flex-wrap gap-1.5">
          {BANK_PARTNERS.map((mark) => (
            <MarkChip key={mark.id} mark={mark} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#D5D0C6] bg-[#EBE8E2]/70 p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7580]">
          Works with leading Indian banks
        </div>
        <span className="text-[9px] font-medium text-[#6B7580] bg-[#FFFFFF] border border-[#D5D0C6] px-1.5 py-0.5 rounded-full">
          AA / NetBanking
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {BANK_PARTNERS.map((mark) => (
          <MarkTile key={mark.id} mark={mark} />
        ))}
      </div>
      <div className="pt-1 border-t border-[#D5D0C6]/80">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7580] mb-1.5">
          Email inboxes
        </div>
        <div className="flex flex-wrap gap-1.5">
          {EMAIL_PARTNERS.map((mark) => (
            <MarkChip key={mark.id} mark={mark} />
          ))}
          <span className="inline-flex items-center text-[10px] text-[#6B7580] px-2">
            + WhatsApp docs
          </span>
        </div>
      </div>
    </div>
  );
}
