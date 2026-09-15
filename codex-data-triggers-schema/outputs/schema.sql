-- Portable SQL: SQLite-tested. PostgreSQL-compatible base types.
-- Run in a dedicated staging schema/database. No DROP or production mutation.

CREATE TABLE departments (
  department_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  navigation_category TEXT,
  taxonomy_note TEXT
);

CREATE TABLE sources (
  source_id TEXT PRIMARY KEY NOT NULL,
  url TEXT,
  title TEXT,
  source_type TEXT,
  supports TEXT,
  retrieval_method TEXT,
  accessed_on TEXT
);

CREATE TABLE jurisdictions (
  jurisdiction_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  level TEXT,
  parent_id TEXT REFERENCES jurisdictions(jurisdiction_id),
  source_id TEXT REFERENCES sources(source_id)
);

CREATE TABLE entity_types (
  entity_type_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  ui_group TEXT
);

CREATE TABLE turnover_bands (
  band_id TEXT PRIMARY KEY NOT NULL,
  label TEXT,
  min_inr NUMERIC,
  max_inr NUMERIC,
  min_inclusive INTEGER CHECK (min_inclusive IN (0,1)),
  max_inclusive INTEGER CHECK (max_inclusive IN (0,1)),
  usage_note TEXT
);

CREATE TABLE trigger_types (
  trigger_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  description TEXT
);

CREATE TABLE authorities (
  authority_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  jurisdiction_id TEXT REFERENCES jurisdictions(jurisdiction_id),
  website_url TEXT,
  source_id TEXT REFERENCES sources(source_id),
  verification_status TEXT
);

CREATE TABLE compliances (
  compliance_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  department_id TEXT REFERENCES departments(department_id),
  obligation_kind TEXT,
  scope_level TEXT,
  catalog_status TEXT
);

CREATE TABLE rule_versions (
  rule_id TEXT PRIMARY KEY NOT NULL,
  compliance_id TEXT REFERENCES compliances(compliance_id),
  jurisdiction_id TEXT REFERENCES jurisdictions(jurisdiction_id),
  authority_id TEXT REFERENCES authorities(authority_id),
  governing_law TEXT,
  form_code TEXT,
  applicability_text TEXT,
  turnover_basis TEXT,
  employee_basis TEXT,
  effective_from TEXT,
  effective_to TEXT,
  tax_period TEXT,
  frequency TEXT,
  deadline_text TEXT,
  deadline_json TEXT,
  exceptions_text TEXT,
  verification_status TEXT,
  automation_enabled INTEGER NOT NULL DEFAULT 0 CHECK (automation_enabled IN (0,1)),
  checked_on TEXT,
  CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from),
  UNIQUE (compliance_id,jurisdiction_id,tax_period,effective_from)
);

CREATE TABLE rule_triggers (
  rule_trigger_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  trigger_id TEXT REFERENCES trigger_types(trigger_id),
  UNIQUE (rule_id,trigger_id)
);

CREATE TABLE rule_entities (
  rule_entity_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  entity_type_id TEXT REFERENCES entity_types(entity_type_id),
  mapping_status TEXT,
  UNIQUE (rule_id,entity_type_id)
);

CREATE TABLE applicability_conditions (
  condition_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  expression_json TEXT,
  expression_status TEXT,
  required_facts_json TEXT,
  notes TEXT
);

CREATE TABLE document_requirements (
  document_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  document_name TEXT,
  entry_kind TEXT,
  requirement_status TEXT,
  condition_text TEXT,
  source_id TEXT REFERENCES sources(source_id)
);

CREATE TABLE process_profiles (
  process_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  application_url TEXT,
  url_role TEXT,
  filing_mode TEXT,
  physical_submission TEXT,
  applicant_visit TEXT,
  inspection TEXT,
  testing_or_notarisation TEXT,
  process_notes TEXT,
  verification_status TEXT,
  UNIQUE (rule_id)
);

CREATE TABLE evidence_assertions (
  assertion_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  source_id TEXT REFERENCES sources(source_id),
  field_name TEXT,
  finding TEXT,
  verification_status TEXT
);

CREATE TABLE legacy_rows (
  legacy_row_id TEXT PRIMARY KEY NOT NULL,
  input_file TEXT,
  input_row_number INTEGER,
  mapped_compliance_id TEXT REFERENCES compliances(compliance_id),
  raw_json TEXT
);

CREATE TABLE state_coverage (
  coverage_id TEXT PRIMARY KEY NOT NULL,
  jurisdiction_id TEXT REFERENCES jurisdictions(jurisdiction_id),
  topic TEXT,
  applicability_status TEXT,
  authority_url TEXT,
  application_url TEXT,
  source_id TEXT REFERENCES sources(source_id),
  coverage_status TEXT,
  next_verification TEXT,
  legacy_row_id TEXT REFERENCES legacy_rows(legacy_row_id),
  UNIQUE (jurisdiction_id,topic)
);

CREATE TABLE coverage_rules (
  coverage_rule_id TEXT PRIMARY KEY NOT NULL,
  coverage_id TEXT REFERENCES state_coverage(coverage_id),
  rule_id TEXT REFERENCES rule_versions(rule_id),
  UNIQUE (coverage_id,rule_id)
);

CREATE TABLE correction_log (
  correction_id TEXT PRIMARY KEY NOT NULL,
  legacy_row_id TEXT REFERENCES legacy_rows(legacy_row_id),
  field_name TEXT,
  original_value TEXT,
  replacement_or_action TEXT,
  source_id TEXT REFERENCES sources(source_id),
  status TEXT
);

CREATE TABLE deadline_overrides (
  override_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  period_key TEXT,
  original_due_date TEXT,
  override_due_date TEXT,
  source_id TEXT REFERENCES sources(source_id),
  notes TEXT
);

CREATE TABLE business_profile_fields (
  field_id TEXT PRIMARY KEY NOT NULL,
  data_type TEXT,
  scope TEXT,
  description TEXT,
  required_for TEXT
);

CREATE TABLE field_reviews (
  review_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  field_name TEXT,
  review_status TEXT,
  evidence_ids_json TEXT,
  review_note TEXT,
  UNIQUE (rule_id,field_name)
);

CREATE TABLE asset_classes (
  asset_class_id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  scope_note TEXT
);

CREATE TABLE rule_asset_scopes (
  rule_asset_scope_id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT REFERENCES rule_versions(rule_id),
  asset_class_id TEXT REFERENCES asset_classes(asset_class_id),
  actor_role TEXT,
  mapping_status TEXT,
  UNIQUE (rule_id,asset_class_id,actor_role)
);

CREATE TABLE state_property_profiles (
  property_profile_id TEXT PRIMARY KEY NOT NULL,
  jurisdiction_id TEXT REFERENCES jurisdictions(jurisdiction_id),
  record_terms TEXT,
  terms_status TEXT,
  ror_url TEXT,
  registration_url TEXT,
  mutation_url TEXT,
  land_revenue_url TEXT,
  source_id TEXT REFERENCES sources(source_id),
  service_source_id TEXT REFERENCES sources(source_id),
  route_status TEXT,
  physical_steps_status TEXT,
  restriction_review TEXT,
  title_note TEXT,
  checked_on TEXT,
  UNIQUE (jurisdiction_id)
);

CREATE INDEX rule_jurisdiction_idx ON rule_versions(jurisdiction_id,compliance_id);
CREATE INDEX rule_trigger_idx ON rule_triggers(trigger_id,rule_id);
CREATE INDEX evidence_rule_idx ON evidence_assertions(rule_id);
