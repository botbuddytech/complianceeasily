# India compliance catalogue — data v1.1.0, schema v1.0.0

Base research cutoff: 14 September 2026. IndiaFilings gap review and additions: 15 September 2026. Prior entries have not all been re-researched on the later date.

This release expands the two supplied CSVs into an auditable research catalogue and a database storage contract. **It is a staging dataset, not an exhaustive or fully verified list of every Indian compliance.** Every state/UT is represented; most state/local procedures still need detailed verification. No customer tasks are enabled, and no server or application files outside this folder have been changed.

## Deliverables

- `outputs/india_compliance_master.csv`: 197 rule versions across 190 compliance definitions. Includes entity filters, trigger categories, turnover/headcount text, due-date rules, document checklists, websites, physical-step fields and sources.
- `outputs/indiafilings_additions.csv`: the 16 entries added during the IndiaFilings review, with the same columns as the master.
- `outputs/indiafilings_gap_review.csv`: 22 topic decisions, including 16 additions and six already-covered mappings, with source links and conflicts. This is a targeted gap scan, not a crawl of every IndiaFilings article.
- `outputs/india_state_compliance_matrix.csv`: 648 rows, covering 18 research topics for each of 36 states/UTs. This is a coverage inventory with selected linked rules, not 648 verified obligations. The physical-step columns remain `unverified` when evidence is missing.
- `outputs/schema.sql`: the 22-table catalogue schema. `outputs/schema.json` gives exact column names, references and import order.
- `outputs/runtime_schema.sql`: 10 optional, empty application tables for businesses, establishments, facts, events, assessments, tasks, licences, notices and receipts.
- `outputs/data_dictionary.csv`: all catalogue columns, storage types and field guidance.
- `outputs/research_backlog.csv`: unresolved state/topic and rule-field research work.
- `outputs/validation_report.json` and `outputs/quality_checks.json`: actual counts and executed checks.
- `inputs/`: unchanged copies of both supplied files. All 133 input rows are also preserved as JSON in `legacy_rows.csv`.

The complete release is `india_compliance_schema_1.1.0.zip` in this folder; `india_compliance_schema_v1.zip` also points to the latest packaged content. The prior package is preserved in `releases/india_compliance_schema_1.0.0.zip`. The flat review CSVs are convenient for people; import the normalized tables for a database. Do not import the master, additions-only export and normalized tables as separate obligations.

## Coverage and evidence

The 36 department IDs are application groupings, not a claim that government has exactly 36 departments. The nine legal-form IDs split the requested NGO group into trust, society and Section 8 company, with an additional `other` value. A charitable tax registration is not itself a legal form.

Of the 197 rule versions, 165 have some source-supported research and 32 remain imported/unverified. **`researched_partial` never means every field is verified.** There are 142 source records, including 17 IndiaFilings discovery pages explicitly classified as secondary commercial sources. Government sources include statutes, notifications, departmental guidance, portals and an official FSSAI video announcement. Search excerpts are distinguished from opened pages; not all URLs were live-tested, and a working portal does not establish the current law.

The IndiaFilings additions cover FLA, PAS-6, SH-7, ADT-3, APEDA, Darpan, REG-16, GSTR-10, LLP-24, STK-2, dormant status/MSC-3, trademark examination replies/opposition counterstatements, DPIIT recognition and company restoration. Optional benefits, exit and remedial procedures are labelled separately. IndiaFilings was used to discover gaps; each addition also has government evidence, sometimes limited to the framework rather than every field.

Conflicts were resolved or qualified rather than copied: RBI current FLA guidance uses FLAIR with special handling for AIFs and revisions; GSTN uses the later cancellation/order date for the GSTR-10 clock; APEDA directs e-RCMC applications to DGFT and publishes five-year validity; DPIIT Gazette 108(E) revises normal/deep-tech recognition thresholds. See the row-specific sources and conflict notes. No source marketing claim of a fully online service was treated as proof that all original-document or inspection requirements disappear.

The state matrix contains 502 discovery-only rows, 106 authority-directory rows, 16 state-topic slots with partial rule research, 20 imported/unverified slots, three additional levy/service-evidenced slots and one flagged conflict. Two municipal jurisdictions have sample rules: MCD and Greater Chennai. This does not cover every city, panchayat, industrial development authority or special economic zone.

Professional tax, shops law, fire, factories, pollution, municipal trade and other local topics are not automatically applicable just because a coverage row exists. Unresearched special sectors—including much banking, insurance, listed-company securities compliance, aviation, maritime, education, hospitality, mining concessions and agriculture subcategories—remain outside detailed coverage. Complete all-India coverage needs an ongoing authority-by-authority inventory.

Important corrections are recorded in `correction_log.csv`: the duplicated GSTR-9C entry, Punjab development-tax omission, conflicting Chhattisgarh PT claim, obsolete FSSAI thresholds/renewal assumptions, director KYC changes, old/new income-tax forms, misleading company-audit triggers, and unsourced universal notice dates. Original claims remain recoverable in `legacy_rows`; they are not evidence of current law.

## Finalized storage contract

Keep three layers separate:

1. **Catalogue:** `compliances` describes the obligation; `rule_versions` stores its jurisdiction, period, legal basis and deadline. One central rule is not copied 36 times merely to inflate coverage.
2. **Research:** `sources`, `evidence_assertions`, `field_reviews`, `correction_log` and `state_coverage` preserve provenance, conflicts and gaps. `coverage_rules` links genuinely researched rules to coverage slots.
3. **Customer operation:** optional runtime tables record business facts and events, assessments and resulting tasks. This release contains no customer data.

Use stable text IDs. C001–C108 preserve input identities; C091 maps to C008 because it is a duplicate. N-prefixed additions and S-prefixed state rules have separate IDs. Rule IDs include a version suffix. Never renumber an ID based on CSV order. When a law changes, append a version and retain prior evidence; do not overwrite a historical customer assessment. Effective dates are inclusive; tax-period applicability must also be resolved. Unknown dates are blank, not an implied beginning of time.

The jurisdiction tree contains India, 36 states/UTs, and two local bodies. Codes such as `IN-TG` are local database keys, not a certified ISO/LGD mapping. Production geocoding should add official LGD/local-body identifiers. A business can have many establishments; apply state/local rules to the correct premises, and PAN-wide turnover rules across the legally relevant scope.

The supplied SQL uses portable base types and is tested with SQLite. PostgreSQL is a reasonable production target, but no PostgreSQL server migration was executed. JSON and dates are stored as TEXT in this portable contract; applications must validate JSON, ISO dates and timezone-aware timestamps. A PostgreSQL migration can use JSONB, DATE, TIMESTAMPTZ and tighter enums without changing the CSV field names. Add tenant access controls in the production application/database; foreign keys alone are not authorization.

## Trigger and eligibility semantics

The exact trigger IDs are `date`, `turnover`, `employee`, `location`, `industry`, `director_partner`, `licence`, `notice`, `law_change`, `transaction`. Multiple triggers can point to one rule. Deduplicate customer tasks by business, establishment or registration scope, compliance, reporting period and triggering event; several triggers must not create duplicate obligations.

Turnover bands are non-overlapping UI filters only. Statutory amounts use exact INR and their own basis: PAN aggregate turnover, company turnover, food-business turnover, professional receipts, or MSME turnover excluding exports. A band boundary is not necessarily a statutory threshold. Keep headcount, wage ceiling, lookback period and employee category separate.

`rule_entities` is a candidate filter, not final eligibility. Conditions use JSON `all` / `any` groups and `eq`, `gt`, `gte`, `lt`, `lte` comparisons. Missing facts return **unknown**. Seven expressions are supplied as examples for e-invoicing, advance tax, ordinary FSSAI tiers, CSR and TReDS. They are incomplete screening conditions; they do not encode every exemption or activity test. `validate_release.py` includes a small reference evaluator and boundary checks.

`deadline_json` distinguishes selected calendars, year-end offsets, event offsets, fixed dates, notice-supplied dates and manual review. Ten researched candidate calendars are included. This is a data contract, not a completed deadline calculation engine. Before generating tasks, resolve rule version, period, calendar choice, time zone, exceptions and notified extensions. A filing extension must not silently extend a payment obligation. Store deadline changes in `instance_deadline_history`.

FSSAI perpetual validity and annual fee obligations use separate runtime licence fields. A perpetual certificate must not have an invented expiry. Notices need the actual provision, service time, reporting period and stated deadline; generic 7/15/30-day assumptions are not used.

All `automation_enabled` values are zero. To enable a rule later, verify operative law, full applicability, exact deadlines and exceptions, documents and process; obtain a recorded review; then test the rule on representative facts. An unknown fact, unreviewed version, or unresolved extension produces `needs_review`, not `not_applicable` or an invented deadline.

## Digital and physical process fields

`filing_mode` describes the submission channel. Separate fields describe `physical_submission`, `applicant_visit`, `inspection`, and `testing_or_notarisation`. Values include `required`, `conditional`, `not_required`, `not_applicable`, and `unverified`. Do not turn `unverified` into No. Site inspection is not necessarily a visit by the applicant to an office. A scan upload does not prove that an executed, stamped or notarised original is unnecessary.

`application_url` can be guidance or a department entry point; read `url_role` and process notes. `authority_url` in coverage is often only a directory-confirmed route. Document rows are currently compound indicative checklists (`entry_kind=compound_checklist`), not individually verified mandatory attachments. They can later be split into separately sourced items; do not split document names mechanically at commas. Imported penalties remain only in raw legacy data and are not validated fee calculations.

## Import and validation

CSV encoding is UTF-8, with a header row and standard double-quote escaping. Embedded JSON is a single CSV field. Empty cells mean SQL NULL; zero and false are meaningful values. For Excel, use Data → From Text/CSV → UTF-8. Treat legacy strings as data, not executable formulas or instructions.

Create a dedicated empty staging schema/database. Execute `schema.sql`, load only the tables listed in `schema.json` in its `import_order`, then optionally execute `runtime_schema.sql`. On PostgreSQL, scope the connection/search path to that new staging schema. The scripts contain CREATE statements and intentionally do not drop existing tables. Do not run them blindly over an existing production schema.

To rebuild locally, run `build_dataset.py`, then `validate_release.py`, then `package_release.py` using Python 3. These scripts require only the standard library and write only inside this folder. They perform no network calls or server uploads. The validator imports actual CSVs into an in-memory SQLite database and tests primary/foreign keys, JSON, all-state coverage, preserved inputs, amount boundaries, unknown-fact behavior, cross-business establishment references and perpetual-licence constraints. This validates structure and selected logic, not legal completeness.

Before a production import, resolve the backlog for the launch jurisdictions and activities, review each rule, implement the remaining eligibility and deadline logic, and run the migration against the actual database engine. The files are ready for research staging and schema review; they are not represented as a complete autonomous compliance engine.
