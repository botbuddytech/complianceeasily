/**
 * Generate one draft blog post per compliance trigger from the catalogue JSON.
 * Idempotent upserts into blog_categories + blog_posts.
 *
 * Usage: npx tsx scripts/generate-compliance-blogs.ts
 */
import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import type {
  ComplianceTrigger,
  ComplianceTriggerDataset,
  DocumentRequirementSummary,
  EvidenceSummary,
  GovDepartment,
} from '../src/lib/compliance/types';
import { extractBlogSections } from '../src/lib/blog/sections';

const prisma = new PrismaClient();

const INTERNAL =
  /legacy_rows|imported rule|unresolved fields|research staging|catalogue|trigger id|codex-|application grouping|not a claim that india|assertion[_ ]?id|\bfield name\b|researched_partial|imported_unverified|curated_unverified|schedule source|verification status|last verified/i;

function clipWords(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > 40 ? cut.slice(0, space) : cut).replace(/[.,;:]$/g, '').trim();
}

/** Drop internal research notes and strings that were cut off with an ellipsis. */
function publicText(value: string | null | undefined): string | null {
  const text = value?.replace(/\s+/g, ' ').trim();
  if (!text) return null;
  if (INTERNAL.test(text)) return null;
  if (text.includes('…') || text.includes('...')) return null;
  if (/\{[a-zA-Z]+\}/.test(text)) return null;
  if (/^(n\/a|na|none|null|unverified|not resolved|not_resolved|unknown|—|-|tbd)$/i.test(text)) {
    return null;
  }
  return text;
}

function guideTitle(trigger: ComplianceTrigger): string {
  return trigger.name.replace(/\s+/g, ' ').trim();
}

function channelLabel(channel: string): string {
  if (channel === 'in_app') return 'the app';
  if (channel === 'whatsapp') return 'WhatsApp';
  if (channel === 'email') return 'email';
  if (channel === 'sms') return 'SMS';
  return channel.replace(/_/g, ' ');
}

function escalationLabel(value: string): string {
  if (value === 'professional') return 'your assigned professional';
  if (value === 'ops_manager') return 'the ComplianceEasily team';
  return value.replace(/_/g, ' ');
}

function triggerTypeSentence(triggerType: string): string {
  switch (triggerType) {
    case 'date':
      return 'It follows a calendar due date.';
    case 'turnover':
      return 'It starts to apply when turnover crosses a set level.';
    case 'employee':
      return 'It starts to apply when headcount crosses a set level.';
    case 'location':
      return 'It starts when you open or shift a location.';
    case 'industry':
      return 'It applies because of the activity the business carries on.';
    case 'director_partner':
      return 'It starts when a director, partner, or owner changes.';
    case 'licence':
      return 'It is tied to getting or renewing a licence.';
    case 'notice':
      return 'It starts when a government notice or intimation arrives.';
    case 'law_change':
      return 'It starts when the law or a notified form changes.';
    case 'transaction':
      return 'It starts when a specific transaction happens, such as a loan, investment, or property deal.';
    default:
      return '';
  }
}

function stepLabel(value: string | undefined): string | null {
  if (!value || value === 'unverified' || value === 'not_applicable') return null;
  if (value === 'required') return 'Required';
  if (value === 'conditional') return 'Only in some cases';
  if (value === 'not_required') return 'Not required';
  return publicText(value.replace(/_/g, ' '));
}

function bullet(items: Array<string | null | undefined | false>): string {
  const lines = items.filter((item): item is string => Boolean(item && item.trim()));
  if (!lines.length) return '';
  return lines.map((item) => `- ${item}`).join('\n');
}

function prose(parts: Array<string | null | undefined | false>): string {
  const sentences = parts
    .map((part) => (typeof part === 'string' ? part.replace(/\s+/g, ' ').trim() : ''))
    .filter(Boolean)
    .map((part) => (/[.!?]$/.test(part) ? part : `${part}.`));
  return sentences.join(' ');
}

function formatList(
  value: string[] | 'all' | undefined,
  allLabel: string,
): string | null {
  if (value === 'all') return allLabel;
  if (!value?.length) return null;
  const items = value
    .map((item) => publicText(item))
    .filter((item): item is string => Boolean(item));
  return items.length ? items.join(', ') : null;
}

function uniqueUrls(...groups: Array<string | undefined | null | string[]>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const g of groups) {
    const list = Array.isArray(g) ? g : g ? [g] : [];
    for (const raw of list) {
      const u = raw?.trim();
      if (!u || seen.has(u)) continue;
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

function docLines(docs: DocumentRequirementSummary[] | undefined): string[] {
  if (!docs?.length) return [];
  return docs.flatMap((d) => {
    const name = publicText(d.documentName);
    if (!name) return [];
    const condition = publicText(d.conditionText);
    const status = stepLabel(d.requirementStatus);
    const bits = [`**${name}**`, status ? `(${status})` : '', condition ? `— ${condition}` : ''].filter(Boolean);
    return [bits.join(' ')];
  });
}

function evidenceUrlLines(evidence: EvidenceSummary[] | undefined): string[] {
  if (!evidence?.length) return [];
  return evidence.flatMap((e) => {
    if (!e.url || !publicText(e.url)) return [];
    const label = publicText(e.sourceTitle);
    const finding = publicText(e.finding);
    const link = label ? `[${label}](${e.url})` : e.url;
    return [`${link}${finding ? ` — ${finding}` : ''}`];
  });
}

function buildBody(
  trigger: ComplianceTrigger,
  dept: GovDepartment | undefined,
): string {
  const a = trigger.applicability;
  const schedule = trigger.schedule;
  const notify = trigger.notification;
  const penalty = trigger.penaltySummary;
  const process = trigger.process;

  const title = guideTitle(trigger);
  const entityLine = formatList(a.entityTypes, 'every kind of entity');
  const industryLine = formatList(a.industries, 'every industry');
  const stateLine = formatList(a.states, 'every state');

  const portalUrls = uniqueUrls(
    dept?.portalUrl,
    dept?.otherPortals,
    trigger.sourceUrl,
    process?.applicationUrl,
    ...(trigger.evidence?.map((e) => e.url) ?? []),
  );

  const thresholdLines =
    trigger.thresholds?.flatMap((t) => {
      const line = publicText(
        `${t.metric} ${t.operator} ${t.value} ${t.unit}: ${t.effect}`.replace(/_/g, ' '),
      );
      return line ? [line] : [];
    }) ?? [];

  const turnoverBits: string[] = [];
  if (a.minTurnoverInr != null) turnoverBits.push(`at least ₹${a.minTurnoverInr.toLocaleString('en-IN')}`);
  if (a.maxTurnoverInr != null) turnoverBits.push(`up to ₹${a.maxTurnoverInr.toLocaleString('en-IN')}`);
  const turnoverBasis = publicText(trigger.turnoverBasis);
  if (turnoverBasis) turnoverBits.push(turnoverBasis);

  const employeeBits: string[] = [];
  if (a.minEmployees != null) employeeBits.push(`at least ${a.minEmployees} employees`);
  const employeeBasis = publicText(trigger.employeeBasis);
  if (employeeBasis) employeeBits.push(employeeBasis);

  const deadlineJson = schedule.deadlineJson as { exception_review?: string[] } | undefined;
  const exceptionBits = [trigger.exceptionsText, ...(deadlineJson?.exception_review ?? [])]
    .map((item) => publicText(item))
    .filter((item): item is string => Boolean(item));

  const lawName = publicText(trigger.governingLaw) || publicText(trigger.legalReference);
  const formName =
    publicText(trigger.formCode) ||
    trigger.forms
      .map((form) => publicText(form))
      .filter((form): form is string => Boolean(form))
      .join(', ') ||
    null;
  const desc = publicText(trigger.description);
  const dueRule = publicText(schedule.dueRule);
  const deadlineText = publicText(trigger.deadlineText);
  const channels = (notify.channels ?? []).map(channelLabel);
  const deptAbout = dept ? publicText(dept.description) : null;
  const deptShort = dept ? publicText(dept.shortName) : null;
  const deptLabel =
    dept && deptShort && deptShort.toLowerCase() !== dept.name.toLowerCase()
      ? `${dept.name} (${deptShort})`
      : dept?.name;
  const orgBits = dept
    ? [dept.ministry, dept.regulator]
        .map((item) => publicText(item))
        .filter((item): item is string => Boolean(item && item.toLowerCase() !== dept.name.toLowerCase()))
    : [];
  const orgLine = [...new Set(orgBits)].join(' · ');
  const processNotes = publicText(process?.processNotes);
  const lateFee = publicText(penalty?.lateFee);
  const interest = publicText(penalty?.interest);
  const maxPenalty = publicText(penalty?.maxPenalty);
  const otherConsequences = (penalty?.otherConsequences ?? [])
    .map((item) => publicText(item))
    .filter((item): item is string => Boolean(item));
  const conditions = publicText(a.conditionsText);

  const summaryLead = prose([
    desc,
    `${title} applies when the facts below match the business, so you can see what to prepare before a due date or an officer visit.`,
    triggerTypeSentence(trigger.triggerType),
    entityLine ? `It typically covers ${entityLine}.` : null,
    trigger.scopeLevel ? `It is handled at ${publicText(trigger.scopeLevel) || trigger.scopeLevel} level.` : null,
    `A ${trigger.professionalType} is the usual professional to review it.`,
    'Confirm the live rule on the government portal before you file or answer an officer.',
  ]);

  const lawLead = prose([
    lawName
      ? `${title} sits under ${lawName}.`
      : `The statute for ${title} is not named on this page. Confirm it on the government portal before you act.`,
    trigger.legalReference && publicText(trigger.legalReference) && publicText(trigger.legalReference) !== lawName
      ? `The reference to use is ${publicText(trigger.legalReference)}.`
      : null,
    formName
      ? `The form or return to look for is ${formName}. Use that name on the portal, and do not file a similarly named form in its place.`
      : 'The form name is not listed here. Identify the current form on the portal before you prepare papers.',
    trigger.effectiveFrom
      ? `It is shown as effective from ${trigger.effectiveFrom}${trigger.effectiveTo ? ` until ${trigger.effectiveTo}` : ''}.`
      : null,
    publicText(trigger.taxPeriod) ? `The period it belongs to is ${publicText(trigger.taxPeriod)}.` : null,
    'The points below are the statute, the form, and the period. If this page and the portal disagree, follow the portal.',
  ]);

  const triggerLead = prose([
    `Put ${title} on the calendar only when the business matches the test below.`,
    triggerTypeSentence(trigger.triggerType),
    entityLine ? `Entity types: ${entityLine}.` : null,
    industryLine ? `Industries: ${industryLine}.` : null,
    stateLine ? `States: ${stateLine}.` : null,
    turnoverBits.length ? `Turnover: ${turnoverBits.join('; ')}.` : 'No turnover limit is set.',
    employeeBits.length ? `Headcount: ${employeeBits.join('; ')}.` : 'No employee limit is set.',
    conditions ? `The practical condition is: ${conditions}` : null,
    a.requiresRegistrations?.length
      ? `You need these registrations first: ${a.requiresRegistrations.join(', ')}.`
      : null,
    'If a required registration is missing, get that registration before treating this as due.',
  ]);

  const portalLead = dept
    ? prose([
        `${deptLabel} is the office that handles ${title}.`,
        `It works at ${dept.level} level${orgLine ? `, through ${orgLine}` : ''}.`,
        deptAbout,
        portalUrls.length
          ? `File, pay, and check status on the ${portalUrls.length === 1 ? 'link' : 'links'} in this section.`
          : 'No official link is listed here yet. Search the department’s own website, not a third-party page.',
        'Use the government page itself. A search snippet is not the filing screen.',
      ])
    : `No government office is listed for ${title} yet. Do not guess the website. Confirm the portal before you file.`;

  const officerLead = prose([
    `If an officer asks about ${title}, open the file. A verbal summary is not enough.`,
    'Keep the documents named below, and note whether the filing is online, needs a visit, or can involve an inspection.',
    processNotes,
    deadlineText
      ? `Keep the papers for this period: ${deadlineText}. Label them by financial year.`
      : 'Label the papers by financial year so you can produce the year the officer asks for.',
    'Match each document to the notice you actually received. This list does not replace the notice or the law.',
  ]);

  const mistakesLead = prose([
    `The mistakes that usually create a notice on ${title} are missing the window, using the wrong form, and keeping records that do not match what was filed.`,
    lateFee ? `Late fee: ${lateFee}.` : null,
    interest ? `Interest: ${interest}.` : null,
    maxPenalty ? `The highest penalty listed is ${maxPenalty}.` : null,
    dueRule ? `The due date to respect is: ${dueRule}.` : null,
    exceptionBits[0] ? `Watch for this exception: ${exceptionBits[0]}` : null,
    'Confirm the live due date on the government portal before each cycle.',
  ]);

  const onlineLead = prose([
    portalUrls.length
      ? `You can check ${title} online on the ${portalUrls.length === 1 ? 'page' : 'pages'} below. Open your own acknowledgement, challan, or status. A screenshot from another year is not proof for this cycle.`
      : `No government page is listed for checking ${title} online. Use the department’s own portal once you have confirmed the address.`,
    'Do not rely on a blog, a WhatsApp forward, or a fee figure that is not on the official page.',
  ]);

  const monitorLead = prose([
    `Track ${title} on a repeating calendar, not as something you remember in the last week.`,
    `How often: ${schedule.frequency.replace(/_/g, ' ')}.`,
    dueRule ? `Due date: ${dueRule}.` : null,
    deadlineText && deadlineText !== dueRule ? `Timing: ${deadlineText}.` : null,
    notify.leadDays?.length
      ? `Reminders go out ${notify.leadDays.join(', ')} days before the due date${channels.length ? ` by ${channels.join(', ')}` : ''}.`
      : null,
    `If it is overdue, it is raised with ${escalationLabel(notify.overdueEscalation)}.`,
    'Keep the due date, the owner, and the document list on the same record so a missing paper does not become a missed filing.',
  ]);

  const helpLead = prose([
    `ComplianceEasily uses the business profile — entity type, state, turnover, headcount, and registrations — to decide whether ${title} belongs on that business’s compliance passport.`,
    'When it does, the due date, the document list, and the reminder sit together, so a notice is less likely to be the first time anyone hears about it.',
    `On a Managed plan, a ${trigger.professionalType} is the person accountable for reviewing this item.`,
    trigger.protectionEligible
      ? 'On Managed plans this item is covered by the Protection Guarantee: a contractual warranty on eligible operational late fees, not insurance.'
      : 'Reminder and document tracking still apply. This item is not covered by the Protection Guarantee.',
    'This does not file the return for you, and it is not a promise that a penalty cannot arise.',
  ]);

  const lawBullets = [
    lawName ? `**Law:** ${lawName}` : null,
    publicText(trigger.legalReference) && publicText(trigger.legalReference) !== lawName
      ? `**Reference:** ${publicText(trigger.legalReference)}`
      : null,
    formName ? `**Form:** ${formName}` : null,
    trigger.effectiveFrom ? `**Effective from:** ${trigger.effectiveFrom}` : null,
    trigger.effectiveTo ? `**Effective to:** ${trigger.effectiveTo}` : null,
    publicText(trigger.taxPeriod) ? `**Period:** ${publicText(trigger.taxPeriod)}` : null,
  ];

  const processBullets = process
    ? [
        stepLabel(process.filingMode) ? `**How you file:** ${stepLabel(process.filingMode)}` : null,
        stepLabel(process.physicalSubmission)
          ? `**Physical submission:** ${stepLabel(process.physicalSubmission)}`
          : null,
        stepLabel(process.applicantVisit) ? `**Visit required:** ${stepLabel(process.applicantVisit)}` : null,
        stepLabel(process.inspection) ? `**Inspection:** ${stepLabel(process.inspection)}` : null,
        stepLabel(process.testingOrNotarisation)
          ? `**Testing or notarisation:** ${stepLabel(process.testingOrNotarisation)}`
          : null,
        processNotes ? `**What to know about the process:** ${processNotes}` : null,
      ]
    : [];

  const sections = [
    `# ${title}`,
    '',
    '## 1. Plain-language summary',
    '',
    summaryLead,
    '',
    bullet([
      publicText(trigger.obligationKind?.replace(/_/g, ' '))
        ? `**What kind of duty:** ${publicText(trigger.obligationKind?.replace(/_/g, ' '))}`
        : null,
      `**How seriously to treat it:** ${trigger.priority}`,
      entityLine ? `**Who it usually covers:** ${entityLine}` : null,
      `**Who should review it:** ${trigger.professionalType}`,
      publicText(trigger.scopeLevel) ? `**Level:** ${publicText(trigger.scopeLevel)}` : null,
    ]),
    '',
    '## 2. The law',
    '',
    lawLead,
    '',
    bullet(lawBullets),
    '',
    exceptionBits.length ? `**Exceptions to watch:**\n\n${bullet(exceptionBits)}` : '',
    '',
    '## 3. What triggers this compliance',
    '',
    triggerLead,
    '',
    bullet([
      entityLine ? `**Entity types:** ${entityLine}` : null,
      industryLine ? `**Industries:** ${industryLine}` : null,
      stateLine ? `**States:** ${stateLine}` : null,
      turnoverBits.length ? `**Turnover:** ${turnoverBits.join('; ')}` : null,
      employeeBits.length ? `**Headcount:** ${employeeBits.join('; ')}` : null,
      a.requiresRegistrations?.length
        ? `**Registrations you need first:** ${a.requiresRegistrations.join(', ')}`
        : null,
      a.excludesRegistrations?.length
        ? `**Does not apply if you already have:** ${a.excludesRegistrations.join(', ')}`
        : null,
      conditions ? `**Condition:** ${conditions}` : null,
    ]),
    '',
    thresholdLines.length ? `**Limits that change whether it applies:**\n\n${bullet(thresholdLines)}` : '',
    '',
    '## 4. Government websites & portals',
    '',
    portalLead,
    '',
    dept
      ? bullet([
          deptLabel ? `**Office:** ${deptLabel}` : null,
          `**Level:** ${dept.level}`,
          orgLine ? `**Ministry or regulator:** ${orgLine}` : null,
          deptAbout ? `**What they handle:** ${deptAbout}` : null,
        ])
      : '',
    '',
    portalUrls.length ? `**Official links:**\n\n${bullet(portalUrls.map((u) => `[${u}](${u})`))}` : '',
    '',
    evidenceUrlLines(trigger.evidence).length
      ? `**Further official sources:**\n\n${bullet(evidenceUrlLines(trigger.evidence))}`
      : '',
    '',
    '## 5. If an officer comes to check — keep this ready',
    '',
    officerLead,
    '',
    docLines(trigger.documents).length
      ? `**Papers to keep ready:**\n\n${bullet(docLines(trigger.documents))}`
      : 'The exact document list is not on this page. Ask for the checklist on the government portal or from your reviewer before an inspection.',
    '',
    bullet(processBullets),
    '',
    '## 6. Mistakes to avoid',
    '',
    mistakesLead,
    '',
    bullet([
      lateFee ? `**Late fee:** ${lateFee}` : null,
      interest ? `**Interest:** ${interest}` : null,
      maxPenalty ? `**Highest penalty listed:** ${maxPenalty}` : null,
      ...otherConsequences.map((item) => `**Other consequence:** ${item}`),
      dueRule ? `**Due date:** ${dueRule}` : null,
      ...exceptionBits.map((item) => `**Exception:** ${item}`),
    ]),
    '',
    '## 7. What you can verify online',
    '',
    onlineLead,
    '',
    portalUrls.length ? bullet(portalUrls.map((u) => `[${u}](${u})`)) : '',
    '',
    '## 8. How to monitor and track it',
    '',
    monitorLead,
    '',
    bullet([
      `**How often:** ${schedule.frequency.replace(/_/g, ' ')}`,
      dueRule ? `**Due date:** ${dueRule}` : null,
      deadlineText && deadlineText !== dueRule ? `**Timing:** ${deadlineText}` : null,
      schedule.dueDay != null ? `**Day of the month:** ${schedule.dueDay}` : null,
      schedule.dueMonths?.length ? `**Months:** ${schedule.dueMonths.join(', ')}` : null,
      schedule.eventOffsetDays != null
        ? `**Days after the event:** ${schedule.eventOffsetDays}`
        : null,
      schedule.financialYearBasis
        ? '**Follows the financial year:** Yes'
        : null,
      notify.leadDays?.length ? `**Reminder:** ${notify.leadDays.join(', ')} days before` : null,
      channels.length ? `**Reminder channels:** ${channels.join(', ')}` : null,
      `**If overdue:** raise it with ${escalationLabel(notify.overdueEscalation)}`,
    ]),
    '',
    '## 9. How ComplianceEasily helps',
    '',
    helpLead,
    '',
    bullet([
      channels.length || notify.leadDays?.length
        ? `**Reminders:** ${channels.join(', ') || 'in the product'} ${notify.leadDays?.length ? `${notify.leadDays.join(', ')} days before the due date` : ''}.`
        : null,
      `**Review:** a ${trigger.professionalType} checks it on a Managed plan.`,
      '**Documents:** collect the papers in the checklist above before the due window, so the filing is not blocked on a missing page.',
      trigger.protectionEligible
        ? '**Protection Guarantee:** on Managed plans, eligible operational late fees are covered by the contractual warranty, not by insurance. See /protection-guarantee for terms.'
        : '**Protection Guarantee:** this item is not covered. Reminders and document tracking still apply.',
      '**Aim:** close the gap before a notice or a penalty arrives.',
    ]),
    '',
    '## 10. Disclaimer',
    '',
    prose([
      `This guide to ${title} is for business owners and their accountants. It is not legal advice and it is not a filing opinion.`,
      lawName
        ? `If this page disagrees with ${lawName} or the government portal, follow the law and the portal.`
        : 'If this page disagrees with the government portal, follow the portal and the statute.',
      'Confirm the current form, fee, and due date before you file or reply to an officer.',
    ]),
  ];
  return sections.filter((s) => s !== null && s !== undefined).join('\n').replace(/\n{3,}/g, '\n\n');
}

function buildExcerpt(trigger: ComplianceTrigger): string {
  const title = guideTitle(trigger);
  const desc = publicText(trigger.description);
  const law = publicText(trigger.legalReference) || publicText(trigger.governingLaw);
  const base = [desc, law].filter(Boolean).join(' ');
  return clipWords(base || title, 220);
}

function buildTags(trigger: ComplianceTrigger, dept: GovDepartment | undefined): string[] {
  const tags = new Set<string>();
  const deptName = dept ? publicText(dept.shortName) || publicText(dept.name) : null;
  if (deptName) tags.add(deptName);
  for (const form of trigger.forms.slice(0, 4)) {
    const clean = publicText(form.replace(/\(.*?\)/g, ''));
    if (clean) tags.add(clean);
  }
  return Array.from(tags).slice(0, 8);
}

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_PASSWORD')) {
    console.error('Set DATABASE_URL in .env first.');
    process.exit(1);
  }

  const raw = readFileSync(
    resolve(process.cwd(), 'src/data/complianceTriggers.json'),
    'utf8',
  );
  const dataset = JSON.parse(raw) as ComplianceTriggerDataset;
  const deptById = new Map(dataset.departments.map((d) => [d.id, d]));

  console.log(
    `Generating blogs for ${dataset.triggers.length} triggers (catalogue v${dataset.meta.version})…`,
  );

  let categoriesUpserted = 0;
  for (const cat of dataset.categories) {
    const id = `cat-${cat.id}`;
    await prisma.blogCategory.upsert({
      where: { id },
      create: {
        id,
        name: cat.name,
        slug: cat.id,
        description: cat.description || `${cat.name} compliance guides`,
        status: 'active',
      },
      update: {
        name: cat.name,
        slug: cat.id,
        description: cat.description || `${cat.name} compliance guides`,
        status: 'active',
      },
    });
    categoriesUpserted += 1;
  }
  console.log(`Upserted ${categoriesUpserted} blog categories from trigger categories.`);

  const categoryIds = new Set(dataset.categories.map((c) => `cat-${c.id}`));
  let postsUpserted = 0;
  let skipped = 0;

  for (let i = 0; i < dataset.triggers.length; i += 1) {
    const trigger = dataset.triggers[i];
    const categoryId = `cat-${trigger.categoryId}`;
    if (!categoryIds.has(categoryId)) {
      console.warn(`Skip ${trigger.id}: missing category ${trigger.categoryId}`);
      skipped += 1;
      continue;
    }

    const dept = deptById.get(trigger.departmentId);
    const id = `blog-trigger-${trigger.id}`;
    const slug = `compliance-${trigger.id}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const title = guideTitle(trigger);
    const body = buildBody(trigger, dept);
    const excerpt = buildExcerpt(trigger);
    const tags = buildTags(trigger, dept);

    await prisma.blogPost.upsert({
      where: { id },
      create: {
        id,
        title,
        slug,
        excerpt,
        body,
        author: 'ComplianceEasily Research',
        categoryId,
        status: 'draft',
        tags,
        publishedAt: null,
      },
      update: {
        title,
        slug,
        excerpt,
        body,
        author: 'ComplianceEasily Research',
        categoryId,
        tags,
      },
    });
    const sections = extractBlogSections(body);
    await prisma.blogSection.deleteMany({ where: { postId: id } });
    if (sections.length) {
      await prisma.blogSection.createMany({
        data: sections.map((section) => ({
          id: `${id}-s${String(section.position).padStart(2, '0')}`,
          postId: id,
          heading: section.heading,
          anchor: section.anchor,
          level: section.level,
          position: section.position,
        })),
      });
    }
    await prisma.blogIndexEntry.updateMany({
      where: { postId: id },
      data: { title, excerpt, slug },
    });
    postsUpserted += 1;

    if ((i + 1) % 25 === 0 || i + 1 === dataset.triggers.length) {
      console.log(`  upserted ${i + 1}/${dataset.triggers.length} posts`);
    }
  }

  const leftoverWhere = {
    OR: [
      { title: { contains: '…' } },
      { title: { contains: '...' } },
      { excerpt: { contains: '…' } },
      { excerpt: { contains: '...' } },
      { body: { contains: '…' } },
      { body: { contains: '...' } },
      { body: { contains: 'catalogue', mode: 'insensitive' as const } },
      { body: { contains: 'Trigger id' } },
      { body: { contains: 'researched_' } },
      { body: { contains: 'imported_unverified' } },
      { body: { contains: 'Schedule source' } },
      { body: { contains: 'verification status', mode: 'insensitive' as const } },
      { body: { contains: 'legacy_rows' } },
      { body: { contains: 'Last verified' } },
      { body: { contains: 'codex-' } },
    ],
  };
  const leftoverCount = await prisma.blogPost.count({ where: leftoverWhere });
  const leftovers = await prisma.blogPost.findMany({
    where: leftoverWhere,
    select: { slug: true, title: true },
    take: 15,
  });
  console.log(`Reader-facing issues remaining: ${leftoverCount}`);
  for (const row of leftovers) console.log(`  ${row.slug} — ${row.title}`);

  console.log(
    `Done. categories=${categoriesUpserted} posts=${postsUpserted} skipped=${skipped}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
