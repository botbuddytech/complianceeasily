"""Package the validated release without accessing the network or writing outside this folder."""
import csv,hashlib,json,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'outputs'
quality=json.loads((OUT/'quality_checks.json').read_text(encoding='utf-8'))
assert quality['result']=='PASS'
schema=json.loads((OUT/'schema.json').read_text(encoding='utf-8'))

guidance={
 'rule_id':'Immutable identifier for one rule version; not merely a compliance name.',
 'compliance_id':'Stable obligation identity shared by versions.',
 'jurisdiction_id':'Country/state/UT/local-body key; use jurisdiction hierarchy.',
 'authority_id':'Competent authority or explicitly qualified routing reference.',
 'source_id':'Source provenance; presence does not verify every field.',
 'form_code':'Period-specific form or qualified form selection.',
 'turnover_basis':'Exact statutory turnover basis and threshold; never substitute UI band.',
 'employee_basis':'Headcount/wages/category/reference-period qualification; may be unverified.',
 'effective_from':'Inclusive ISO date; blank means unresolved, not always applicable.',
 'effective_to':'Inclusive ISO date; blank alone does not prove current applicability.',
 'tax_period':'Period/law transition label; resolve explicitly before selection.',
 'deadline_json':'JSON candidate deadline specification; not an enabled scheduler.',
 'expression_json':'JSON all/any comparison condition; missing facts evaluate unknown.',
 'required_facts_json':'JSON array of required business-profile field IDs.',
 'automation_enabled':'0 in this release; research review required before activation.',
 'document_name':'Checklist text in this release; entry_kind identifies granularity.',
 'entry_kind':'compound_checklist currently; can support individual items later.',
 'filing_mode':'Submission channel only; does not establish absence of physical steps.',
 'physical_submission':'Paper/original submission requirement; unverified is not No.',
 'applicant_visit':'Personal attendance requirement, separate from premises inspection.',
 'inspection':'Premises/product/vehicle inspection requirement; read source scope.',
 'testing_or_notarisation':'Additional physical or executed-document step, separately assessed.',
 'application_url':'May be guidance or entry point; inspect url_role.',
 'authority_url':'Discovery or authority route; not necessarily an application endpoint.',
 'url_role':'Qualification of how to interpret the URL.',
 'verification_status':'Scope-limited research status; never a blanket legal warranty.',
 'review_status':'Field-level evidence status, not automatic legal approval.',
 'coverage_status':'Research inventory progress; coverage row is not an obligation.',
 'applicability_status':'State-topic research finding, distinct from customer eligibility.',
 'mapping_status':'Entity candidate filter only, not a complete applicability test.',
 'raw_json':'Unchanged source CSV row serialized as JSON; untrusted input data.',
 'input_row_number':'Original CSV physical record index counting the header as row 1.',
 'retrieval_method':'opened_page or search_excerpt; not proof every endpoint works.',
 'accessed_on':'Research access date; source publication/effective date can differ.',
 'checked_on':'Research processing date; not a production approval timestamp.',
 'evidence_ids_json':'JSON array referencing evidence_assertions.assertion_id.',
 'period_key':'Exact reporting period; never treat one-off extensions as recurring.',
 'original_due_date':'Original due date for the specified period only.',
 'override_due_date':'Revised due date for the specified period and obligation only.',
 'min_inr':'Exact INR lower boundary for UI band.',
 'max_inr':'Exact INR upper boundary; NULL means unbounded.',
 'min_inclusive':'1 includes lower boundary; 0 excludes it.',
 'max_inclusive':'1 includes upper boundary; 0 excludes it.'}
rows=[]
for t,cols in schema['tables'].items():
    for c in cols:
        rows.append(dict(table_name=t,column_name=c['name'],sql_type=c['sql_type'],primary_key=int(c['primary_key']),references=c['references'] or '',description=guidance.get(c['name'],c['name'].replace('_',' ').capitalize()+'; see README for table semantics.'),null_semantics='Empty CSV cell imports as SQL NULL; primary keys cannot be empty'))
def write(name,rows,cols):
    with (OUT/name).open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=cols,lineterminator='\r\n');w.writeheader();w.writerows(rows)
write('data_dictionary.csv',rows,list(rows[0]))
backlog=[]
with (OUT/'state_coverage.csv').open(encoding='utf-8',newline='') as f:
    for r in csv.DictReader(f):
        backlog.append(dict(item_id='COV-'+r['coverage_id'],item_type='state_topic',reference_id=r['coverage_id'],status=r['coverage_status'],work_required=r['next_verification']))
with (OUT/'field_reviews.csv').open(encoding='utf-8',newline='') as f:
    for r in csv.DictReader(f):
        backlog.append(dict(item_id='FIELD-'+r['review_id'],item_type='rule_field',reference_id=r['rule_id'],status=r['review_status'],work_required='Review '+r['field_name']+': '+r['review_note']))
write('research_backlog.csv',backlog,list(backlog[0]))
shutil.copyfile(ROOT/'research/runtime_schema.sql',OUT/'runtime_schema.sql')
shutil.copyfile(ROOT/'README.md',OUT/'README.md')
manifest={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.iterdir()) if p.is_file() and p.name!='checksums.json'}
(OUT/'checksums.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
archive=ROOT/'india_compliance_schema_v1.zip'
files=[ROOT/'README.md',ROOT/'build_dataset.py',ROOT/'validate_release.py',ROOT/'package_release.py']
files += [p for folder in ['inputs','research','outputs'] for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
    for p in sorted(files):
        assert p.resolve().is_relative_to(ROOT)
        z.write(p,p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(files)
shutil.copyfile(archive,ROOT/'india_compliance_schema_1.2.0.zip')
print(json.dumps({'archive':str(archive),'files':len(files),'bytes':archive.stat().st_size,'zip_integrity':'PASS','backlog_items':len(backlog)},indent=2))
