"""Validate CSV + SQL release, candidate conditions and runtime invariants without network.
Run after build_dataset.py. The only persistent write is outputs/quality_checks.json.
"""
import csv, json, sqlite3
from pathlib import Path
from decimal import Decimal
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'outputs'

def evaluate(expr,facts):
    """Three-valued candidate screening. None means unknown, never not-applicable."""
    for group in ('all','any'):
        if group in expr:
            if not expr[group]: raise ValueError('Empty condition group')
            vals=[evaluate(x,facts) for x in expr[group]]
            if group=='all': return False if False in vals else (None if None in vals else True)
            return True if True in vals else (None if None in vals else False)
    name=expr['field']; op=expr['op']; expected=expr['value']
    if name not in facts or facts[name] is None: return None
    actual=facts[name]
    if op=='eq':
        if isinstance(expected,bool) and not isinstance(actual,bool): raise ValueError('Expected boolean')
        return actual==expected
    if isinstance(actual,bool) or isinstance(expected,bool): raise ValueError('Boolean is not money')
    a,b=Decimal(str(actual)),Decimal(str(expected))
    if not a.is_finite() or not b.is_finite(): raise ValueError('Non-finite number')
    if op=='gt': return a>b
    if op=='gte': return a>=b
    if op=='lt': return a<b
    if op=='lte': return a<=b
    raise ValueError('Unsupported operator: '+op)

def load_database():
    db=sqlite3.connect(':memory:'); db.execute('PRAGMA foreign_keys=ON')
    db.executescript((OUT/'schema.sql').read_text(encoding='utf-8'))
    manifest=json.loads((OUT/'schema.json').read_text(encoding='utf-8'))
    for table in manifest['import_order']:
        cols=[c['name'] for c in manifest['tables'][table]]
        with (OUT/(table+'.csv')).open(encoding='utf-8',newline='') as f:
            reader=csv.DictReader(f)
            assert reader.fieldnames==cols,table
            for row in reader:
                assert None not in row,('extra CSV cell',table)
                db.execute(f'INSERT INTO {table} VALUES ({",".join("?" for _ in cols)})',[None if row[c]=='' else row[c] for c in cols])
    db.executescript((ROOT/'research/runtime_schema.sql').read_text(encoding='utf-8'))
    assert not db.execute('PRAGMA foreign_key_check').fetchall()
    return db

def main():
    db=load_database()
    conditions={r:json.loads(e) for r,e in db.execute('SELECT rule_id,expression_json FROM applicability_conditions')}
    tests=0
    def check(expr,facts,expected):
        nonlocal tests
        assert evaluate(expr,facts) is expected,(facts,expected)
        tests+=1
    einvoice=conditions['C011-V1']
    for value,result in [(49999999,False),(50000000,False),(50000001,True)]:
        check(einvoice,{'gst_max_aato_since_2017_inr':value,'gst_registered':True,'e_invoice_exempt':False},result)
    check(einvoice,{'gst_max_aato_since_2017_inr':50000001,'gst_registered':True},None)
    check(einvoice,{'gst_max_aato_since_2017_inr':50000001,'gst_registered':True,'e_invoice_exempt':True},False)
    for value,result in [(9999,False),(10000,True)]:
        check(conditions['C052-V1'],{'estimated_net_tax_inr':value,'is_exempt_senior_citizen':False},result)
    for value,expected in [(15000000,'C075-V1'),(15000001,'C076-V1'),(500000000,'C076-V1'),(500000001,'C077-V1')]:
        facts={'food_turnover_inr':value,'special_fssai_category':False}
        for rid in ['C075-V1','C076-V1','C077-V1']: check(conditions[rid],facts,rid==expected)
    for value,result in [(2500000000,False),(2500000001,True)]: check(conditions['N002-V1'],{'company_turnover_inr':value,'is_cpse':False},result)
    check(conditions['N002-V1'],{'is_cpse':True},True)
    check(conditions['N001-V1'],{'net_profit_inr':50000000},True)
    check(conditions['N001-V1'],{'net_profit_inr':49999999},None)
    # Field provenance and category coverage.
    profile={x[0] for x in db.execute('SELECT field_id FROM business_profile_fields')}
    for raw, in db.execute('SELECT required_facts_json FROM applicability_conditions'):
        assert set(json.loads(raw))<=profile
    assert db.execute('SELECT COUNT(*) FROM rule_versions WHERE automation_enabled<>0').fetchone()[0]==0
    assert not db.execute('SELECT department_id FROM departments EXCEPT SELECT department_id FROM compliances').fetchall()
    assert db.execute('SELECT COUNT(DISTINCT jurisdiction_id) FROM state_coverage').fetchone()[0]==36
    assert db.execute('SELECT COUNT(*) FROM legacy_rows').fetchone()[0]==133
    assert db.execute("SELECT COUNT(*) FROM compliances WHERE compliance_id LIKE 'IF%'").fetchone()[0]==16
    with (OUT/'indiafilings_additions.csv').open(encoding='utf-8',newline='') as f:
        additions=list(csv.DictReader(f))
    assert len(additions)==16
    assert {r['rule_id'] for r in additions}=={x[0] for x in db.execute("SELECT rule_id FROM rule_versions WHERE compliance_id LIKE 'IF%'")}
    for rid, in db.execute("SELECT rule_id FROM rule_versions WHERE compliance_id LIKE 'IF%'"):
        assert db.execute("SELECT COUNT(*) FROM evidence_assertions e JOIN sources s USING(source_id) WHERE e.rule_id=? AND s.source_type <> 'secondary_commercial'",(rid,)).fetchone()[0]>0
        assert db.execute("SELECT COUNT(*) FROM evidence_assertions e JOIN sources s USING(source_id) WHERE e.rule_id=? AND s.source_type = 'secondary_commercial' AND e.verification_status <> 'secondary_discovery_only'",(rid,)).fetchone()[0]==0
    # Test real FK separation: another business cannot attach its fact to this establishment.
    db.execute("INSERT INTO businesses VALUES ('B1','T1','Example 1','llp','2026-09-14T00:00:00Z')")
    db.execute("INSERT INTO businesses VALUES ('B2','T2','Example 2','llp','2026-09-14T00:00:00Z')")
    db.execute("INSERT INTO establishments VALUES ('E1','B1','IN-MH','Office',NULL,NULL,NULL)")
    rejected=False
    try:
        db.execute("INSERT INTO business_facts VALUES ('F1','B2','E1','employee_count','10','2026-09',NULL,NULL,NULL,'2026-09-14T00:00:00Z')")
    except sqlite3.IntegrityError: rejected=True
    assert rejected
    rejected=False
    try:
        db.execute("INSERT INTO licences VALUES ('L1','B1','E1',NULL,NULL,NULL,'2026-04-01','2027-04-01',1,NULL,'{}')")
    except sqlite3.IntegrityError: rejected=True
    assert rejected
    assert db.execute('SELECT COUNT(*) FROM state_property_profiles').fetchone()[0]==36
    for topic in ['property_ror','property_mutation','land_revenue','deed_registration','encumbrance_title','land_use_eligibility','boundary_survey','property_tax']:
        assert db.execute('SELECT COUNT(*) FROM state_coverage WHERE topic=?',(topic,)).fetchone()[0]==36
    assert db.execute("SELECT COUNT(*) FROM compliances WHERE compliance_id LIKE 'AX%'").fetchone()[0]==43
    assert db.execute("SELECT COUNT(*) FROM rule_asset_scopes WHERE rule_id IN ('C060-V1','C060-V2')").fetchone()[0]==4
    assert db.execute("SELECT COUNT(*) FROM state_property_profiles WHERE title_note LIKE '%alone do not establish title%'").fetchone()[0]==36
    assert db.execute("SELECT COUNT(*) FROM rule_entities WHERE rule_id='AX004-V1' AND entity_type_id<>'individual'").fetchone()[0]==0
    db.execute("INSERT INTO assets VALUES ('A1','B1','land','IN-WB','Test parcel','{}','owner',NULL,NULL)")
    db.execute("INSERT INTO asset_facts VALUES ('AF1','B1','A1','property_mutation_status','\"pending\"',NULL,NULL,NULL,'2026-09-15T00:00:00Z')")
    rejected=False
    try:
        db.execute("INSERT INTO asset_facts VALUES ('AF2','B2','A1','property_mutation_status','\"ordered\"',NULL,NULL,NULL,'2026-09-15T00:00:00Z')")
    except sqlite3.IntegrityError: rejected=True
    assert rejected
    rejected=False
    try:
        db.execute("INSERT INTO asset_record_reviews VALUES ('AR1','B1','A1','mutation','M1',NULL,NULL,'title_guaranteed','{}',NULL,NULL)")
    except sqlite3.IntegrityError: rejected=True
    assert rejected
    # No mock customer records are exported; all tests above are in memory.
    report={'result':'PASS','candidate_condition_assertions':tests,'csv_headers_and_sql_import':'PASS','foreign_keys':'PASS','all_36_department_groups_have_catalog_entries':'PASS','all_36_states_uts_have_coverage':'PASS','all_133_input_rows_preserved':'PASS','cross_business_establishment_fk':'PASS','perpetual_licence_expiry_constraint':'PASS','automation_disabled':'PASS','database_engine_tested':'SQLite only; PostgreSQL script not server-tested','legal_completeness':'NOT VERIFIED; see field_reviews and state_coverage'}
    report.update(indiafilings_new_entries=16,each_new_entry_has_official_evidence='PASS',commercial_sources_kept_secondary='PASS')
    report.pop('all_36_department_groups_have_catalog_entries')
    report.update(all_39_department_groups_have_catalog_entries='PASS',all_36_property_profiles_and_eight_topics='PASS',asset_licence_additions=43,cross_owner_asset_fk='PASS',mutation_not_title_status='PASS',lrs_personal_entity_scope='PASS')
    (OUT/'quality_checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))

if __name__=='__main__': main()
