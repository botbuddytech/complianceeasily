'use client';

import { FormEvent, useState } from 'react';
import { createEntity } from '@/lib/actions/domain';

const ENTITY_TYPES = ['Pvt Ltd', 'LLP', 'OPC', 'Partnership', 'Proprietorship', 'Public Ltd'];
const REGISTRATION_OPTIONS = [
  'GSTIN', 'TAN', 'PAN', 'CIN', 'DIN', 'FSSAI', 'EPF', 'ESIC', 'PT',
  'Shops & Establishment', 'Trade Licence', 'Udyam', 'IEC', 'Factory Licence', 'CTO', 'CTE',
];

export function CreateEntityForm({
  workspaceId,
  clientId,
  onDone,
}: {
  workspaceId: string;
  clientId: string;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<string[]>(['GSTIN', 'PAN']);
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    entityType: 'Pvt Ltd',
    state: 'West Bengal',
    industry: 'Food & Restaurants',
    locations: 1,
    gstin: '',
    pan: '',
    cin: '',
    employees: 0,
    annualTurnoverInr: 0,
    planId: 'pro' as 'free' | 'pro' | 'managed',
  });

  const toggleReg = (r: string) => {
    setRegistrations((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await createEntity({
      workspaceId,
      clientId,
      ...form,
      registrations,
      activities: [],
    });
    setSubmitting(false);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setOpen(false);
    onDone?.();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-xl bg-[#0E1217] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1A2129]"
      >
        Add entity
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1217]/50 p-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#D5D0C6] bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#0E1217]">Add business entity</h2>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-[#6B7580]">
            Close
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ['name', 'Legal name', 'text'],
              ['shortName', 'Short name', 'text'],
              ['state', 'State', 'text'],
              ['industry', 'Industry', 'text'],
              ['gstin', 'GSTIN', 'text'],
              ['pan', 'PAN', 'text'],
              ['cin', 'CIN', 'text'],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
              {label}
              <input
                required={key === 'name' || key === 'shortName' || key === 'state' || key === 'industry'}
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm text-[#0E1217]"
              />
            </label>
          ))}

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
            Entity type
            <select
              value={form.entityType}
              onChange={(e) => setForm((f) => ({ ...f, entityType: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
            >
              {ENTITY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
            Plan
            <select
              value={form.planId}
              onChange={(e) =>
                setForm((f) => ({ ...f, planId: e.target.value as 'free' | 'pro' | 'managed' }))
              }
              className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="managed">Managed</option>
            </select>
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
            Locations
            <input
              type="number"
              min={1}
              value={form.locations}
              onChange={(e) => setForm((f) => ({ ...f, locations: Number(e.target.value) }))}
              className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
            Employees
            <input
              type="number"
              min={0}
              value={form.employees}
              onChange={(e) => setForm((f) => ({ ...f, employees: Number(e.target.value) }))}
              className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7580] sm:col-span-2">
            Annual turnover (INR)
            <input
              type="number"
              min={0}
              value={form.annualTurnoverInr}
              onChange={(e) =>
                setForm((f) => ({ ...f, annualTurnoverInr: Number(e.target.value) }))
              }
              className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7580]">
            Registrations (drive trigger matching)
          </div>
          <div className="flex flex-wrap gap-2">
            {REGISTRATION_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggleReg(r)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  registrations.includes(r)
                    ? 'border-[#0E1217] bg-[#0E1217] text-white'
                    : 'border-[#D5D0C6] bg-white text-[#5C6570]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-[#F04438]">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-[#D5D0C6] px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#B89E6B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Create & match triggers'}
          </button>
        </div>
      </form>
    </div>
  );
}
