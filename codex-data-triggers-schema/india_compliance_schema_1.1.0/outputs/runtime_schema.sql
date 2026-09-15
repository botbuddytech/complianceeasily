-- Optional application tables. Create AFTER schema.sql in the same isolated database.
-- Empty by design. This release contains no customer data or generated customer tasks.
CREATE TABLE businesses (
 business_id TEXT PRIMARY KEY NOT NULL,
 tenant_id TEXT NOT NULL,
 legal_name TEXT NOT NULL,
 entity_type_id TEXT NOT NULL REFERENCES entity_types(entity_type_id),
 created_at TEXT NOT NULL,
 UNIQUE (tenant_id,business_id)
);
CREATE TABLE establishments (
 establishment_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 jurisdiction_id TEXT NOT NULL REFERENCES jurisdictions(jurisdiction_id),
 name TEXT NOT NULL,
 address_text TEXT,
 opened_on TEXT,
 closed_on TEXT,
 CHECK (closed_on IS NULL OR opened_on IS NULL OR closed_on >= opened_on),
 UNIQUE (business_id,establishment_id)
);
CREATE TABLE business_facts (
 fact_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 establishment_id TEXT,
 field_id TEXT NOT NULL REFERENCES business_profile_fields(field_id),
 value_json TEXT NOT NULL,
 period_key TEXT NOT NULL,
 valid_from TEXT,
 valid_to TEXT,
 evidence_reference TEXT,
 recorded_at TEXT NOT NULL,
 FOREIGN KEY (business_id,establishment_id) REFERENCES establishments(business_id,establishment_id),
 CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
);
CREATE TABLE business_events (
 event_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 establishment_id TEXT,
 trigger_id TEXT NOT NULL REFERENCES trigger_types(trigger_id),
 event_type TEXT NOT NULL,
 occurred_at TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 idempotency_key TEXT NOT NULL,
 FOREIGN KEY (business_id,establishment_id) REFERENCES establishments(business_id,establishment_id),
 UNIQUE (business_id,idempotency_key),
 UNIQUE (business_id,event_id)
);
CREATE TABLE applicability_assessments (
 assessment_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 establishment_id TEXT,
 rule_id TEXT NOT NULL REFERENCES rule_versions(rule_id),
 event_id TEXT,
 period_key TEXT NOT NULL,
 result TEXT NOT NULL CHECK (result IN ('applicable','not_applicable','unknown','needs_review')),
 facts_snapshot_json TEXT NOT NULL,
 explanation_json TEXT NOT NULL,
 evaluated_at TEXT NOT NULL,
 reviewed_by TEXT,
 reviewed_at TEXT,
 FOREIGN KEY (business_id,establishment_id) REFERENCES establishments(business_id,establishment_id),
 FOREIGN KEY (business_id,event_id) REFERENCES business_events(business_id,event_id),
 UNIQUE (business_id,assessment_id)
);
CREATE TABLE compliance_instances (
 instance_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 assessment_id TEXT NOT NULL,
 period_key TEXT NOT NULL,
 deduplication_key TEXT NOT NULL,
 due_at TEXT,
 due_basis_json TEXT NOT NULL,
 state TEXT NOT NULL CHECK (state IN ('needs_review','open','in_progress','submitted','completed','waived','cancelled')),
 created_at TEXT NOT NULL,
 completed_at TEXT,
 FOREIGN KEY (business_id,assessment_id) REFERENCES applicability_assessments(business_id,assessment_id),
 UNIQUE (business_id,deduplication_key),
 UNIQUE (business_id,instance_id)
);
CREATE TABLE instance_deadline_history (
 change_id TEXT PRIMARY KEY NOT NULL,
 instance_id TEXT NOT NULL REFERENCES compliance_instances(instance_id),
 previous_due_at TEXT,
 revised_due_at TEXT,
 source_id TEXT REFERENCES sources(source_id),
 reason TEXT NOT NULL,
 changed_at TEXT NOT NULL
);
CREATE TABLE licences (
 licence_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 establishment_id TEXT,
 compliance_id TEXT REFERENCES compliances(compliance_id),
 authority_id TEXT REFERENCES authorities(authority_id),
 certificate_reference TEXT,
 issued_on TEXT,
 expires_on TEXT,
 perpetual_validity INTEGER NOT NULL DEFAULT 0 CHECK (perpetual_validity IN (0,1)),
 next_fee_due_on TEXT,
 conditions_json TEXT NOT NULL,
 FOREIGN KEY (business_id,establishment_id) REFERENCES establishments(business_id,establishment_id),
 CHECK (perpetual_validity = 0 OR expires_on IS NULL),
 CHECK (expires_on IS NULL OR issued_on IS NULL OR expires_on >= issued_on)
);
CREATE TABLE notices (
 notice_id TEXT PRIMARY KEY NOT NULL,
 business_id TEXT NOT NULL REFERENCES businesses(business_id),
 establishment_id TEXT,
 authority_id TEXT REFERENCES authorities(authority_id),
 event_id TEXT,
 provision_text TEXT NOT NULL,
 period_key TEXT,
 issued_on TEXT,
 served_at TEXT,
 stated_due_at TEXT,
 document_reference TEXT,
 FOREIGN KEY (business_id,establishment_id) REFERENCES establishments(business_id,establishment_id),
 FOREIGN KEY (business_id,event_id) REFERENCES business_events(business_id,event_id)
);
CREATE TABLE submission_receipts (
 submission_id TEXT PRIMARY KEY NOT NULL,
 instance_id TEXT NOT NULL REFERENCES compliance_instances(instance_id),
 submitted_at TEXT NOT NULL,
 acknowledgement_reference TEXT,
 receipt_reference TEXT,
 outcome TEXT NOT NULL,
 recorded_by TEXT NOT NULL
);
CREATE INDEX business_fact_lookup ON business_facts(business_id,field_id,period_key);
CREATE INDEX business_event_lookup ON business_events(business_id,trigger_id,occurred_at);
CREATE INDEX instance_due_lookup ON compliance_instances(business_id,state,due_at);
