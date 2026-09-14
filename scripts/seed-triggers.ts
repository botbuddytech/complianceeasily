import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import type { ComplianceTriggerDataset } from '../src/lib/compliance/types';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('your-project')) {
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const raw = readFileSync(
    resolve(process.cwd(), 'src/data/complianceTriggers.json'),
    'utf8',
  );
  const dataset = JSON.parse(raw) as ComplianceTriggerDataset;

  console.log(`Seeding trigger catalogue v${dataset.meta.version}…`);

  const { error: metaErr } = await supabase.from('trigger_meta').upsert({
    id: 1,
    version: dataset.meta.version,
    last_verified: dataset.meta.lastVerified,
    disclaimer: dataset.meta.disclaimer,
    sources: dataset.meta.sources,
  });
  if (metaErr) throw metaErr;

  const { error: typesErr } = await supabase.from('trigger_types').upsert(
    dataset.triggerTypes.map((t) => ({
      id: t.id,
      label: t.label,
      subtitle: t.subtitle,
      description: t.description,
      icon_name: t.iconName,
    })),
  );
  if (typesErr) throw typesErr;

  const { error: deptErr } = await supabase.from('gov_departments').upsert(
    dataset.departments.map((d) => ({
      id: d.id,
      name: d.name,
      short_name: d.shortName,
      level: d.level,
      ministry: d.ministry,
      regulator: d.regulator,
      portal_url: d.portalUrl,
      other_portals: d.otherPortals,
      category_ids: d.categoryIds,
      description: d.description,
      icon_name: d.iconName,
    })),
  );
  if (deptErr) throw deptErr;

  const { error: catErr } = await supabase.from('trigger_categories').upsert(
    dataset.categories.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      department_ids: c.departmentIds,
      description: c.description,
    })),
  );
  if (catErr) throw catErr;

  const rows = dataset.triggers.map((t) => ({
    id: t.id,
    name: t.name,
    short_name: t.shortName,
    department_id: t.departmentId,
    category_id: t.categoryId,
    trigger_type: t.triggerType,
    priority: t.priority,
    status: t.status,
    legal_reference: t.legalReference,
    forms: t.forms,
    description: t.description,
    source_url: t.sourceUrl,
    last_verified: t.lastVerified,
    applicability: t.applicability,
    schedule: t.schedule,
    notification: t.notification,
    thresholds: t.thresholds,
    penalty_summary: t.penaltySummary,
    linked_service_ids: t.linkedServiceIds,
    protection_eligible: t.protectionEligible,
    professional_type: t.professionalType,
  }));

  // Upsert in chunks
  const chunkSize = 50;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from('compliance_triggers').upsert(chunk);
    if (error) throw error;
    console.log(`  upserted triggers ${i + 1}–${i + chunk.length}`);
  }

  console.log(`Done. ${rows.length} triggers seeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
