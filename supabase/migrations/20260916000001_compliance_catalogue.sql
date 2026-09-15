-- ComplianceEasily: codex catalogue schema (v1.2.0 data / v1.1.0 schema)
-- Additive: creates normalized catalogue + provenance tables and extends compliance_triggers.
-- Does NOT drop existing tables. Safe to run on an existing database.

-- ---------------------------------------------------------------------------
-- Lookup / dimension tables
-- ---------------------------------------------------------------------------

create table if not exists public.catalogue_entity_types (
  entity_type_id text primary key,
  name text not null,
  ui_group text not null default '',
  display_labels text[] not null default '{}'
);

create table if not exists public.catalogue_turnover_bands (
  band_id text primary key,
  label text not null,
  min_inr numeric,
  max_inr numeric,
  min_inclusive boolean not null default true,
  max_inclusive boolean not null default false,
  usage_note text not null default ''
);

create table if not exists public.catalogue_departments (
  department_id text primary key,
  name text not null,
  navigation_category text not null default '',
  taxonomy_note text not null default ''
);

create table if not exists public.jurisdictions (
  jurisdiction_id text primary key,
  name text not null,
  level text not null,
  parent_id text references public.jurisdictions (jurisdiction_id),
  source_id text
);

create table if not exists public.catalogue_sources (
  source_id text primary key,
  url text,
  title text,
  source_type text,
  supports text,
  retrieval_method text,
  accessed_on date
);

create table if not exists public.authorities (
  authority_id text primary key,
  name text not null,
  jurisdiction_id text references public.jurisdictions (jurisdiction_id),
  website_url text,
  source_id text references public.catalogue_sources (source_id),
  verification_status text not null default 'unverified'
);

create table if not exists public.asset_classes (
  asset_class_id text primary key,
  name text not null,
  scope_note text not null default ''
);

create table if not exists public.business_profile_fields (
  field_id text primary key,
  data_type text not null,
  scope text not null default '',
  description text not null default '',
  required_for text not null default ''
);

-- ---------------------------------------------------------------------------
-- Core catalogue
-- ---------------------------------------------------------------------------

create table if not exists public.compliances (
  compliance_id text primary key,
  name text not null,
  department_id text references public.catalogue_departments (department_id),
  obligation_kind text not null default 'mandatory_if_applicable',
  scope_level text not null default 'central',
  catalog_status text not null default 'imported_unverified'
);

create table if not exists public.rule_versions (
  rule_id text primary key,
  compliance_id text not null references public.compliances (compliance_id),
  jurisdiction_id text references public.jurisdictions (jurisdiction_id),
  authority_id text references public.authorities (authority_id),
  governing_law text,
  form_code text,
  applicability_text text,
  turnover_basis text,
  employee_basis text,
  effective_from date,
  effective_to date,
  tax_period text,
  frequency text,
  deadline_text text,
  deadline_json jsonb not null default '{}'::jsonb,
  exceptions_text text,
  verification_status text not null default 'imported_unverified',
  automation_enabled boolean not null default false,
  checked_on date,
  constraint rule_versions_effective_chk
    check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create index if not exists rule_versions_compliance_idx on public.rule_versions (compliance_id);
create index if not exists rule_versions_jurisdiction_idx on public.rule_versions (jurisdiction_id);
create index if not exists rule_versions_verification_idx on public.rule_versions (verification_status);

create table if not exists public.rule_triggers (
  rule_trigger_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  trigger_id text not null references public.trigger_types (id),
  unique (rule_id, trigger_id)
);

create table if not exists public.rule_entities (
  rule_entity_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  entity_type_id text not null references public.catalogue_entity_types (entity_type_id),
  mapping_status text not null default 'candidate',
  unique (rule_id, entity_type_id)
);

create table if not exists public.applicability_conditions (
  condition_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  expression_json jsonb not null default '{}'::jsonb,
  expression_status text not null default 'candidate_condition_requires_full_rule_review',
  required_facts_json jsonb not null default '[]'::jsonb,
  notes text
);

create table if not exists public.document_requirements (
  document_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  document_name text not null,
  entry_kind text not null default 'compound_checklist',
  requirement_status text not null default 'indicative',
  condition_text text,
  source_id text references public.catalogue_sources (source_id)
);

create table if not exists public.process_profiles (
  process_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade unique,
  application_url text,
  url_role text,
  filing_mode text not null default 'unverified',
  physical_submission text not null default 'unverified',
  applicant_visit text not null default 'unverified',
  inspection text not null default 'unverified',
  testing_or_notarisation text not null default 'unverified',
  process_notes text,
  verification_status text not null default 'unverified'
);

create table if not exists public.rule_asset_scopes (
  rule_asset_scope_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  asset_class_id text not null references public.asset_classes (asset_class_id),
  actor_role text not null,
  mapping_status text not null default 'candidate',
  unique (rule_id, asset_class_id, actor_role)
);

create table if not exists public.deadline_overrides (
  override_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  period_key text,
  original_due_date date,
  override_due_date date,
  source_id text references public.catalogue_sources (source_id),
  notes text
);

-- ---------------------------------------------------------------------------
-- Coverage & property
-- ---------------------------------------------------------------------------

create table if not exists public.state_coverage (
  coverage_id text primary key,
  jurisdiction_id text not null references public.jurisdictions (jurisdiction_id),
  topic text not null,
  applicability_status text,
  authority_url text,
  application_url text,
  source_id text references public.catalogue_sources (source_id),
  coverage_status text not null default 'discovery_only',
  next_verification text,
  unique (jurisdiction_id, topic)
);

create index if not exists state_coverage_jurisdiction_idx on public.state_coverage (jurisdiction_id);
create index if not exists state_coverage_topic_idx on public.state_coverage (topic);

create table if not exists public.coverage_rules (
  coverage_rule_id text primary key,
  coverage_id text not null references public.state_coverage (coverage_id) on delete cascade,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  unique (coverage_id, rule_id)
);

create table if not exists public.state_property_profiles (
  property_profile_id text primary key,
  jurisdiction_id text not null references public.jurisdictions (jurisdiction_id) unique,
  record_terms text,
  terms_status text,
  ror_url text,
  registration_url text,
  mutation_url text,
  land_revenue_url text,
  source_id text references public.catalogue_sources (source_id),
  service_source_id text references public.catalogue_sources (source_id),
  route_status text,
  physical_steps_status text,
  restriction_review text,
  title_note text,
  checked_on date
);

-- ---------------------------------------------------------------------------
-- Provenance
-- ---------------------------------------------------------------------------

create table if not exists public.evidence_assertions (
  assertion_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  source_id text references public.catalogue_sources (source_id),
  field_name text,
  finding text,
  verification_status text
);

create index if not exists evidence_assertions_rule_idx on public.evidence_assertions (rule_id);

create table if not exists public.field_reviews (
  review_id text primary key,
  rule_id text not null references public.rule_versions (rule_id) on delete cascade,
  field_name text not null,
  review_status text not null default 'unreviewed',
  evidence_ids_json jsonb not null default '[]'::jsonb,
  review_note text,
  unique (rule_id, field_name)
);

create table if not exists public.correction_log (
  correction_id text primary key,
  legacy_row_id text,
  field_name text,
  original_value text,
  replacement_or_action text,
  source_id text references public.catalogue_sources (source_id),
  status text
);

-- ---------------------------------------------------------------------------
-- Extend runtime compliance_triggers projection
-- ---------------------------------------------------------------------------

alter table public.compliance_triggers
  add column if not exists rule_id text references public.rule_versions (rule_id) on delete set null,
  add column if not exists compliance_id text references public.compliances (compliance_id) on delete set null,
  add column if not exists jurisdiction_id text references public.jurisdictions (jurisdiction_id) on delete set null,
  add column if not exists obligation_kind text not null default 'mandatory_if_applicable',
  add column if not exists scope_level text not null default 'central',
  add column if not exists verification_status text not null default 'imported_unverified',
  add column if not exists deadline_text text not null default '',
  add column if not exists schedule_source text not null default 'curated_unverified',
  add column if not exists automation_enabled boolean not null default false,
  add column if not exists process_json jsonb not null default '{}'::jsonb,
  add column if not exists documents_json jsonb not null default '[]'::jsonb,
  add column if not exists condition_json jsonb,
  add column if not exists evidence_json jsonb not null default '[]'::jsonb;

create index if not exists compliance_triggers_rule_idx on public.compliance_triggers (rule_id);
create index if not exists compliance_triggers_jurisdiction_idx on public.compliance_triggers (jurisdiction_id);
create index if not exists compliance_triggers_verification_idx on public.compliance_triggers (verification_status);
create index if not exists compliance_triggers_automation_idx on public.compliance_triggers (automation_enabled);

-- Extend entity_trigger_matches for tri-state results
alter table public.entity_trigger_matches
  add column if not exists result text not null default 'not_applicable'
    check (result in ('applicable', 'not_applicable', 'unknown', 'needs_review')),
  add column if not exists missing_facts jsonb not null default '[]'::jsonb;

comment on table public.compliances is 'Codex catalogue compliance definitions (C/N/A/S/I families)';
comment on table public.rule_versions is 'Versioned jurisdiction-scoped rules; automation_enabled gates filing materialization';
comment on column public.compliance_triggers.schedule_source is 'codex_typed | curated_unverified | none';
comment on column public.compliance_triggers.automation_enabled is 'Must be true AND obligation_kind eligible to materialize filings';
