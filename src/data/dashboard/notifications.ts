import { NotificationPreference } from '../../types/dashboard';

export const NOTIFICATION_PREFS: NotificationPreference[] = [
  {
    id: 'notif-wa',
    channel: 'whatsapp',
    label: 'WhatsApp Radar',
    description: 'Due-date reminders and filing status updates on WhatsApp.',
    enabled: true,
    events: [
      { id: 'wa-due', label: 'Upcoming due dates (T-7, T-3, T-1)', enabled: true },
      { id: 'wa-overdue', label: 'Overdue filings', enabled: true },
      { id: 'wa-filed', label: 'Filing acknowledgements', enabled: true },
      { id: 'wa-docs', label: 'Document requests from professionals', enabled: false },
    ],
  },
  {
    id: 'notif-email',
    channel: 'email',
    label: 'Email',
    description: 'Weekly digests and formal notices to your registered email.',
    enabled: true,
    events: [
      { id: 'em-weekly', label: 'Weekly compliance digest', enabled: true },
      { id: 'em-invoice', label: 'Billing & invoices', enabled: true },
      { id: 'em-team', label: 'Team invitations & access changes', enabled: true },
      { id: 'em-claims', label: 'Protection claim updates', enabled: true },
    ],
  },
  {
    id: 'notif-sms',
    channel: 'sms',
    label: 'SMS',
    description: 'Critical alerts only — overdue and protection events.',
    enabled: false,
    events: [
      { id: 'sms-overdue', label: 'Overdue filings', enabled: false },
      { id: 'sms-claims', label: 'Protection claim decisions', enabled: false },
    ],
  },
  {
    id: 'notif-app',
    channel: 'in_app',
    label: 'In-app',
    description: 'Bell notifications inside your ComplianceEasily dashboard.',
    enabled: true,
    events: [
      { id: 'app-all', label: 'All activity', enabled: true },
      { id: 'app-mentions', label: 'Mentions & assignments only', enabled: false },
    ],
  },
];
