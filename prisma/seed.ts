import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient, type ProfessionalType, type TriggerPriority, type TriggerStatus } from '@prisma/client';
import type { ComplianceTriggerDataset } from '../src/lib/compliance/types';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_PASSWORD')) {
    console.error('Set DATABASE_URL in .env (Supabase Postgres connection string) first.');
    process.exit(1);
  }

  const raw = readFileSync(
    resolve(process.cwd(), 'src/data/complianceTriggers.json'),
    'utf8',
  );
  const dataset = JSON.parse(raw) as ComplianceTriggerDataset;

  console.log(`Seeding trigger catalogue v${dataset.meta.version} via Prisma…`);

  await prisma.triggerMeta.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      version: dataset.meta.version,
      lastVerified: new Date(dataset.meta.lastVerified),
      disclaimer: dataset.meta.disclaimer,
      sources: dataset.meta.sources,
    },
    update: {
      version: dataset.meta.version,
      lastVerified: new Date(dataset.meta.lastVerified),
      disclaimer: dataset.meta.disclaimer,
      sources: dataset.meta.sources,
    },
  });

  for (const t of dataset.triggerTypes) {
    await prisma.triggerType.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        label: t.label,
        subtitle: t.subtitle,
        description: t.description,
        iconName: t.iconName,
      },
      update: {
        label: t.label,
        subtitle: t.subtitle,
        description: t.description,
        iconName: t.iconName,
      },
    });
  }

  for (const d of dataset.departments) {
    await prisma.govDepartment.upsert({
      where: { id: d.id },
      create: {
        id: d.id,
        name: d.name,
        shortName: d.shortName,
        level: d.level,
        ministry: d.ministry,
        regulator: d.regulator,
        portalUrl: d.portalUrl,
        otherPortals: d.otherPortals,
        categoryIds: d.categoryIds,
        description: d.description,
        iconName: d.iconName,
      },
      update: {
        name: d.name,
        shortName: d.shortName,
        level: d.level,
        ministry: d.ministry,
        regulator: d.regulator,
        portalUrl: d.portalUrl,
        otherPortals: d.otherPortals,
        categoryIds: d.categoryIds,
        description: d.description,
        iconName: d.iconName,
      },
    });
  }

  for (const c of dataset.categories) {
    await prisma.triggerCategory.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name,
        code: c.code,
        departmentIds: c.departmentIds,
        description: c.description,
      },
      update: {
        name: c.name,
        code: c.code,
        departmentIds: c.departmentIds,
        description: c.description,
      },
    });
  }

  let i = 0;
  for (const t of dataset.triggers) {
    await prisma.complianceTrigger.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        departmentId: t.departmentId,
        categoryId: t.categoryId,
        triggerTypeId: t.triggerType,
        priority: t.priority as TriggerPriority,
        status: t.status as TriggerStatus,
        legalReference: t.legalReference,
        forms: t.forms,
        description: t.description,
        sourceUrl: t.sourceUrl,
        lastVerified: t.lastVerified ? new Date(t.lastVerified) : null,
        applicability: t.applicability as object,
        schedule: t.schedule as object,
        notification: t.notification as object,
        thresholds: t.thresholds as object[],
        penaltySummary: t.penaltySummary as object,
        linkedServiceIds: t.linkedServiceIds,
        protectionEligible: t.protectionEligible,
        professionalType: t.professionalType as ProfessionalType,
      },
      update: {
        name: t.name,
        shortName: t.shortName,
        departmentId: t.departmentId,
        categoryId: t.categoryId,
        triggerTypeId: t.triggerType,
        priority: t.priority as TriggerPriority,
        status: t.status as TriggerStatus,
        legalReference: t.legalReference,
        forms: t.forms,
        description: t.description,
        sourceUrl: t.sourceUrl,
        lastVerified: t.lastVerified ? new Date(t.lastVerified) : null,
        applicability: t.applicability as object,
        schedule: t.schedule as object,
        notification: t.notification as object,
        thresholds: t.thresholds as object[],
        penaltySummary: t.penaltySummary as object,
        linkedServiceIds: t.linkedServiceIds,
        protectionEligible: t.protectionEligible,
        professionalType: t.professionalType as ProfessionalType,
      },
    });

    // Extended catalogue projection columns (no-op until migration + generate)
    try {
      await (prisma.complianceTrigger.update as (args: unknown) => Promise<unknown>)({
        where: { id: t.id },
        data: {
          obligationKind: t.obligationKind ?? 'mandatory_if_applicable',
          scopeLevel: t.scopeLevel ?? 'central',
          verificationStatus: t.verificationStatus ?? 'imported_unverified',
          deadlineText: t.deadlineText ?? '',
          scheduleSource: t.scheduleSource ?? 'curated_unverified',
          automationEnabled: Boolean(t.automationEnabled),
          processJson: t.process ?? {},
          documentsJson: t.documents ?? [],
          conditionJson: t.condition ?? null,
          evidenceJson: t.evidence ?? [],
        },
      });
    } catch {
      /* columns may not exist until migration is applied */
    }

    i += 1;
    if (i % 25 === 0) console.log(`  upserted ${i}/${dataset.triggers.length} triggers`);
  }

  // Seed catalogue dimensions from complianceCatalogue.json (idempotent lookups)
  // Uses dynamic access so seed still typechecks before `prisma generate` after schema changes.
  try {
    const catalogueRaw = readFileSync(
      resolve(process.cwd(), 'src/data/complianceCatalogue.json'),
      'utf8',
    );
    const catalogue = JSON.parse(catalogueRaw) as {
      entityTypes: Array<{ entityTypeId: string; name: string; uiGroup: string; displayLabels: string[] }>;
      jurisdictions: Array<{ jurisdictionId: string; name: string; level: string; parentId?: string | null }>;
      departments: Array<{ departmentId: string; name: string; navigationCategory: string }>;
      turnoverBands: Array<{ id: string; label: string; minInr: number; maxInr: number | null }>;
      businessProfileFields: Array<{ fieldId: string; dataType: string; scope: string; description: string; requiredFor: string }>;
      assetClasses: Array<{ assetClassId: string; name: string; scopeNote: string }>;
    };

    const db = prisma as unknown as {
      catalogueEntityType: { upsert: (args: unknown) => Promise<unknown> };
      jurisdiction: { upsert: (args: unknown) => Promise<unknown> };
      catalogueDepartment: { upsert: (args: unknown) => Promise<unknown> };
      catalogueTurnoverBand: { upsert: (args: unknown) => Promise<unknown> };
      businessProfileField: { upsert: (args: unknown) => Promise<unknown> };
      assetClass: { upsert: (args: unknown) => Promise<unknown> };
    };

    for (const e of catalogue.entityTypes) {
      await db.catalogueEntityType.upsert({
        where: { entityTypeId: e.entityTypeId },
        create: {
          entityTypeId: e.entityTypeId,
          name: e.name,
          uiGroup: e.uiGroup,
          displayLabels: e.displayLabels,
        },
        update: { name: e.name, uiGroup: e.uiGroup, displayLabels: e.displayLabels },
      });
    }

    const sortedJ = [...catalogue.jurisdictions].sort((a, b) => {
      if (a.parentId && !b.parentId) return 1;
      if (!a.parentId && b.parentId) return -1;
      return 0;
    });
    for (const j of sortedJ) {
      await db.jurisdiction.upsert({
        where: { jurisdictionId: j.jurisdictionId },
        create: {
          jurisdictionId: j.jurisdictionId,
          name: j.name,
          level: j.level,
          parentId: j.parentId || null,
        },
        update: { name: j.name, level: j.level, parentId: j.parentId || null },
      });
    }

    for (const d of catalogue.departments) {
      await db.catalogueDepartment.upsert({
        where: { departmentId: d.departmentId },
        create: {
          departmentId: d.departmentId,
          name: d.name,
          navigationCategory: d.navigationCategory,
        },
        update: { name: d.name, navigationCategory: d.navigationCategory },
      });
    }

    for (const b of catalogue.turnoverBands) {
      await db.catalogueTurnoverBand.upsert({
        where: { bandId: b.id },
        create: {
          bandId: b.id,
          label: b.label,
          minInr: b.minInr,
          maxInr: b.maxInr,
        },
        update: { label: b.label, minInr: b.minInr, maxInr: b.maxInr },
      });
    }

    for (const f of catalogue.businessProfileFields) {
      await db.businessProfileField.upsert({
        where: { fieldId: f.fieldId },
        create: {
          fieldId: f.fieldId,
          dataType: f.dataType,
          scope: f.scope,
          description: f.description,
          requiredFor: f.requiredFor,
        },
        update: {
          dataType: f.dataType,
          scope: f.scope,
          description: f.description,
          requiredFor: f.requiredFor,
        },
      });
    }

    for (const a of catalogue.assetClasses) {
      await db.assetClass.upsert({
        where: { assetClassId: a.assetClassId },
        create: {
          assetClassId: a.assetClassId,
          name: a.name,
          scopeNote: a.scopeNote,
        },
        update: { name: a.name, scopeNote: a.scopeNote },
      });
    }
    console.log('Catalogue dimension tables seeded.');
  } catch (err) {
    console.warn('Catalogue dimension seed skipped:', err);
  }

  // Baseline plans / permission scopes / fee schedule (idempotent)
  await prisma.plan.createMany({
    data: [
      {
        id: 'free',
        name: 'Compliance Radar',
        priceDisplay: '₹0',
        period: 'month',
        features: ['WhatsApp reminders', '1 entity'],
      },
      {
        id: 'pro',
        name: 'Compliance Pro',
        priceDisplay: '₹999',
        period: 'month',
        features: ['Multi-entity', 'Document vault', 'Professional network'],
      },
      {
        id: 'managed',
        name: 'Managed + Protected',
        priceDisplay: '₹4,999',
        period: 'month',
        features: ['Managed filings', 'Protection guarantee', 'Dedicated CA'],
      },
    ],
    skipDuplicates: true,
  });

  await prisma.permissionScope.createMany({
    data: [
      { scope: 'all', description: 'Full access' },
      { scope: 'clients', description: 'Manage clients' },
      { scope: 'clients:read', description: 'Read clients' },
      { scope: 'filings', description: 'Manage filings' },
      { scope: 'filings:review', description: 'Review filings' },
      { scope: 'claims', description: 'Manage claims' },
      { scope: 'claims:review', description: 'Review protection claims' },
      { scope: 'professionals', description: 'Manage professionals' },
      { scope: 'support', description: 'Support tickets' },
      { scope: 'catalogue', description: 'Manage catalogue' },
      { scope: 'catalogue:read', description: 'Read catalogue' },
      { scope: 'users', description: 'Manage staff users' },
    ],
    skipDuplicates: true,
  });

  await prisma.serviceFeeSchedule.createMany({
    data: [
      { category: 'GST', feeInr: 499 },
      { category: 'Income Tax', feeInr: 999 },
      { category: 'MCA', feeInr: 1499 },
      { category: 'Labour', feeInr: 799 },
      { category: 'Licences', feeInr: 1499 },
      { category: 'Audit', feeInr: 7499 },
      { category: 'Accounting', feeInr: 1499 },
    ],
    skipDuplicates: true,
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword && adminPassword.length >= 8) {
    const { hashPassword } = await import('../src/lib/auth/password');
    const passwordHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        passwordHash,
        fullName: 'Platform Admin',
        role: 'staff',
        status: 'active',
        avatarInitials: 'PA',
      },
      update: {
        passwordHash,
        role: 'staff',
        status: 'active',
      },
    });
    console.log(`Seeded staff admin: ${adminEmail}`);
  }

  console.log(`Done. ${dataset.triggers.length} triggers seeded via Prisma.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
