"""Build an auditable CSV research release. No network access or server writes.
All output paths are confined to the directory containing this file.
"""
import csv, hashlib, json, re, sqlite3, zipfile
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'outputs'
ASOF = '2026-09-14'
TABLES = {}
SCHEMA = {}

def table(name, spec):
    # column:type[:reference], first column is the primary key
    SCHEMA[name] = [s.split(':') for s in spec.split('|')]
    TABLES[name] = []

table('departments','department_id:TEXT|name:TEXT|navigation_category:TEXT|taxonomy_note:TEXT')
table('jurisdictions','jurisdiction_id:TEXT|name:TEXT|level:TEXT|parent_id:TEXT:jurisdictions.jurisdiction_id|source_id:TEXT:sources.source_id')
table('entity_types','entity_type_id:TEXT|name:TEXT|ui_group:TEXT')
table('turnover_bands','band_id:TEXT|label:TEXT|min_inr:NUMERIC|max_inr:NUMERIC|min_inclusive:INTEGER|max_inclusive:INTEGER|usage_note:TEXT')
table('trigger_types','trigger_id:TEXT|name:TEXT|description:TEXT')
table('sources','source_id:TEXT|url:TEXT|title:TEXT|source_type:TEXT|supports:TEXT|retrieval_method:TEXT|accessed_on:TEXT')
table('authorities','authority_id:TEXT|name:TEXT|jurisdiction_id:TEXT:jurisdictions.jurisdiction_id|website_url:TEXT|source_id:TEXT:sources.source_id|verification_status:TEXT')
table('compliances','compliance_id:TEXT|name:TEXT|department_id:TEXT:departments.department_id|obligation_kind:TEXT|scope_level:TEXT|catalog_status:TEXT')
table('rule_versions','rule_id:TEXT|compliance_id:TEXT:compliances.compliance_id|jurisdiction_id:TEXT:jurisdictions.jurisdiction_id|authority_id:TEXT:authorities.authority_id|governing_law:TEXT|form_code:TEXT|applicability_text:TEXT|turnover_basis:TEXT|employee_basis:TEXT|effective_from:TEXT|effective_to:TEXT|tax_period:TEXT|frequency:TEXT|deadline_text:TEXT|deadline_json:TEXT|exceptions_text:TEXT|verification_status:TEXT|automation_enabled:INTEGER|checked_on:TEXT')
table('rule_triggers','rule_trigger_id:TEXT|rule_id:TEXT:rule_versions.rule_id|trigger_id:TEXT:trigger_types.trigger_id')
table('rule_entities','rule_entity_id:TEXT|rule_id:TEXT:rule_versions.rule_id|entity_type_id:TEXT:entity_types.entity_type_id|mapping_status:TEXT')
table('applicability_conditions','condition_id:TEXT|rule_id:TEXT:rule_versions.rule_id|expression_json:TEXT|expression_status:TEXT|required_facts_json:TEXT|notes:TEXT')
table('document_requirements','document_id:TEXT|rule_id:TEXT:rule_versions.rule_id|document_name:TEXT|entry_kind:TEXT|requirement_status:TEXT|condition_text:TEXT|source_id:TEXT:sources.source_id')
table('process_profiles','process_id:TEXT|rule_id:TEXT:rule_versions.rule_id|application_url:TEXT|url_role:TEXT|filing_mode:TEXT|physical_submission:TEXT|applicant_visit:TEXT|inspection:TEXT|testing_or_notarisation:TEXT|process_notes:TEXT|verification_status:TEXT')
table('evidence_assertions','assertion_id:TEXT|rule_id:TEXT:rule_versions.rule_id|source_id:TEXT:sources.source_id|field_name:TEXT|finding:TEXT|verification_status:TEXT')
table('state_coverage','coverage_id:TEXT|jurisdiction_id:TEXT:jurisdictions.jurisdiction_id|topic:TEXT|applicability_status:TEXT|authority_url:TEXT|application_url:TEXT|source_id:TEXT:sources.source_id|coverage_status:TEXT|next_verification:TEXT|legacy_row_id:TEXT:legacy_rows.legacy_row_id')
table('coverage_rules','coverage_rule_id:TEXT|coverage_id:TEXT:state_coverage.coverage_id|rule_id:TEXT:rule_versions.rule_id')
table('legacy_rows','legacy_row_id:TEXT|input_file:TEXT|input_row_number:INTEGER|mapped_compliance_id:TEXT:compliances.compliance_id|raw_json:TEXT')
table('correction_log','correction_id:TEXT|legacy_row_id:TEXT:legacy_rows.legacy_row_id|field_name:TEXT|original_value:TEXT|replacement_or_action:TEXT|source_id:TEXT:sources.source_id|status:TEXT')
table('deadline_overrides','override_id:TEXT|rule_id:TEXT:rule_versions.rule_id|period_key:TEXT|original_due_date:TEXT|override_due_date:TEXT|source_id:TEXT:sources.source_id|notes:TEXT')
table('business_profile_fields','field_id:TEXT|data_type:TEXT|scope:TEXT|description:TEXT|required_for:TEXT')
table('field_reviews','review_id:TEXT|rule_id:TEXT:rule_versions.rule_id|field_name:TEXT|review_status:TEXT|evidence_ids_json:TEXT|review_note:TEXT')
TABLE_ORDER=['departments','sources','jurisdictions','entity_types','turnover_bands','trigger_types','authorities','compliances','rule_versions','rule_triggers','rule_entities','applicability_conditions','document_requirements','process_profiles','evidence_assertions','legacy_rows','state_coverage','coverage_rules','correction_log','deadline_overrides','business_profile_fields','field_reviews']

def add(t, **kw):
    cols=[s[0] for s in SCHEMA[t]]
    assert not (set(kw)-set(cols)), (t,set(kw)-set(cols))
    row={k:kw.get(k,'') for k in cols}
    TABLES[t].append(row)
    return row

for s in json.loads((ROOT/'research/sources.json').read_text(encoding='utf-8')):
    add('sources',source_id=s[0],url=s[1],title=s[2],source_type=s[3],supports=s[4],retrieval_method=s[5],accessed_on=ASOF)

def source(sid,url,title,scope,kind='guidance',method='search_excerpt'):
    if sid not in {s['source_id'] for s in TABLES['sources']}:
        add('sources',source_id=sid,url=url,title=title,source_type=kind,supports=scope,retrieval_method=method,accessed_on=ASOF)

DEPTS = [
 ('MCA','MCA / ROC','MCA / ROC'),('LLP','LLP filings','MCA / ROC'),('NGO','Trusts, societies and FCRA','MCA / ROC'),
 ('GST','GST and indirect tax','GST & Indirect Tax'),('INCOME_TAX','Income tax','Income Tax & TDS'),('TDS_TCS','TDS and TCS','Income Tax & TDS'),
 ('EPFO','EPFO','Labour, HR & Payroll'),('ESIC','ESIC','Labour, HR & Payroll'),('LABOUR','Wages and industrial relations','Labour, HR & Payroll'),('POSH','POSH','Labour, HR & Payroll'),
 ('PT','Profession / development tax','State & Local'),('SHOPS','Shops and establishments','State & Local'),('LWF','Labour welfare funds','Labour, HR & Payroll'),('FACTORY','Factories and occupational safety','Business Licences'),
 ('POLLUTION','Pollution consents and environment','Business Licences'),('WASTE','Waste and EPR','Business Licences'),('MUNICIPAL','Municipal and building approvals','State & Local'),('FIRE','Fire safety','State & Local'),
 ('FSSAI','Food safety / FSSAI','Food / FSSAI'),('DGFT','Foreign trade / DGFT','Import & Export'),('CUSTOMS','Customs','Import & Export'),('MSME','MSME and delayed payments','Business Licences'),
 ('AUDIT','Audit and assurance','Audit & Assurance'),('IP','Intellectual property','Intellectual Property'),('BOOKS','Accounting and records','Accounting & Books'),('FEMA','FEMA and RBI reporting','Business Licences'),
 ('LEGAL_METROLOGY','Legal metrology','Business Licences'),('BIS','BIS and product standards','Business Licences'),('DRUGS_HEALTH','Drugs, cosmetics and healthcare','Business Licences'),('RERA','Real estate / RERA','Business Licences'),
 ('TRANSPORT','Transport and vehicles','Business Licences'),('TELECOM','Telecom and wireless','Business Licences'),('DATA_CYBER','Data protection and cyber incidents','Notices & Responses'),('ENERGY_PESO','Energy, boilers and PESO','Business Licences'),
 ('AGRI_MINING','Agriculture and mining','Business Licences'),('EXCISE','State excise and controlled trades','State & Local')]
for did,n,c in DEPTS:
    add('departments',department_id=did,name=n,navigation_category=c,taxonomy_note='Application grouping; not a claim that India has exactly 36 government departments')

ENTITIES = [('sole_proprietor','Sole proprietorship','Sole Proprietorship'),('partnership','Partnership firm','Partnership Firm'),('llp','Limited liability partnership','Limited Liability Partnership (LLP)'),('private_company','Private limited company','Private Limited Company'),('public_company','Public limited company','Public Limited Company'),('trust','Trust','NGO'),('society','Society','NGO'),('section8','Section 8 company','NGO'),('other','Other legal form / specialised regulated entity','Other')]
for eid,n,g in ENTITIES: add('entity_types',entity_type_id=eid,name=n,ui_group=g)
for i,(label,lo,hi,li,ui) in enumerate([
 ('Under INR 20 lakh',0,2000000,1,0),('INR 20 lakh to under INR 40 lakh',2000000,4000000,1,0),
 ('INR 40 lakh to under INR 1.5 crore',4000000,15000000,1,0),('INR 1.5 crore to under INR 5 crore',15000000,50000000,1,0),
 ('INR 5 crore to INR 50 crore',50000000,500000000,1,1),('Above INR 50 crore',500000000,'',0,0)],1):
    add('turnover_bands',band_id=f'B{i}',label=label,min_inr=lo,max_inr=hi,min_inclusive=li,max_inclusive=ui,usage_note='UI filter only; exact INR conditions and statutory turnover basis control applicability')
TRIGGERS = [('date','Date Trigger','Calendar or period-based obligation'),('turnover','Turnover Trigger','Crossing a monetary threshold using its statutory basis'),('employee','Employee Trigger','Headcount, wages, worker type or service period'),('location','Location Trigger','New establishment, branch, state or local jurisdiction'),('industry','Industry Trigger','Activity, product, capacity or sector'),('director_partner','Director / Partner Trigger','Corporate or partnership governance event'),('licence','Licence Trigger','Validity, renewal, annual fee or licence-condition event'),('notice','Notice Trigger','Receipt of notice, order, demand or communication'),('law_change','Law Change Trigger','Commencement or amendment; reassess linked rules'),('transaction','Transaction Trigger','Specified transaction, payment, issue, transfer or incident')]
for tid,n,d in TRIGGERS: add('trigger_types',trigger_id=tid,name=n,description=d)

STATES = [('AN','Andaman and Nicobar Islands','union_territory'),('AP','Andhra Pradesh','state'),('AR','Arunachal Pradesh','state'),('AS','Assam','state'),('BR','Bihar','state'),('CH','Chandigarh','union_territory'),('CG','Chhattisgarh','state'),('DN','Dadra and Nagar Haveli and Daman and Diu','union_territory'),('DL','Delhi','union_territory'),('GA','Goa','state'),('GJ','Gujarat','state'),('HR','Haryana','state'),('HP','Himachal Pradesh','state'),('JK','Jammu and Kashmir','union_territory'),('JH','Jharkhand','state'),('KA','Karnataka','state'),('KL','Kerala','state'),('LA','Ladakh','union_territory'),('LD','Lakshadweep','union_territory'),('MP','Madhya Pradesh','state'),('MH','Maharashtra','state'),('MN','Manipur','state'),('ML','Meghalaya','state'),('MZ','Mizoram','state'),('NL','Nagaland','state'),('OD','Odisha','state'),('PY','Puducherry','union_territory'),('PB','Punjab','state'),('RJ','Rajasthan','state'),('SK','Sikkim','state'),('TN','Tamil Nadu','state'),('TG','Telangana','state'),('TR','Tripura','state'),('UP','Uttar Pradesh','state'),('UK','Uttarakhand','state'),('WB','West Bengal','state')]
add('jurisdictions',jurisdiction_id='IN',name='India',level='country',source_id='NSWS')
for code,n,l in STATES: add('jurisdictions',jurisdiction_id='IN-'+code,name=n,level=l,parent_id='IN',source_id='NSWS')

PORTALS={
 'MCA':('MCA / Registrar of Companies','https://www.mca.gov.in/','MCA_PORTAL'), 'LLP':('MCA / Registrar of LLPs','https://www.mca.gov.in/','MCA_PORTAL'),
 'GST':('CBIC / GSTN and jurisdictional GST authority','https://www.gst.gov.in/','GST_1'), 'INCOME_TAX':('CBDT / Income Tax Department','https://www.incometax.gov.in/','IT_FORMS'), 'TDS_TCS':('CBDT / Income Tax Department','https://www.incometax.gov.in/','IT_FORMS'),
 'EPFO':('Employees Provident Fund Organisation','https://www.epfindia.gov.in/','EPF_DUE'), 'ESIC':('Employees State Insurance Corporation','https://www.esic.gov.in/','ESI_RATES'),
 'LABOUR':('Ministry of Labour / appropriate government','https://www.labour.gov.in/','LABOUR_CODES'), 'FACTORY':('Appropriate government / factory inspectorate','https://www.labour.gov.in/','OSH_FAQ'),
 'FSSAI':('FSSAI / State food safety authority','https://foscos.fssai.gov.in/','FSSAI_PORTAL'), 'DGFT':('Directorate General of Foreign Trade','https://www.dgft.gov.in/','DGFT_FTP'),
 'MSME':('Ministry of MSME','https://udyamregistration.gov.in/','UDYAM'), 'IP':('CGPDTM / IP India','https://ipindia.gov.in/pages/e-services','IP'),
 'FEMA':('Reserve Bank of India / Authorised Dealer bank','https://firms.rbi.org.in/','RBI_FIRMS'), 'POLLUTION':('MoEFCC / CPCB / SPCB or PCC','https://cpcb.gov.in/','CPCB_DIR'), 'WASTE':('CPCB / SPCB or PCC','https://cpcb.gov.in/','CPCB_DIR'),
 'BIS':('Bureau of Indian Standards','https://www.bis.gov.in/','BIS'), 'LEGAL_METROLOGY':('Department of Consumer Affairs / State Controller','https://consumeraffairs.gov.in/pages/legal-metrology-overview','LM'),
 'DRUGS_HEALTH':('CDSCO / State licensing authority','https://www.cdsco.gov.in/','CDSCO'), 'ENERGY_PESO':('PESO / State energy or boiler authority','https://www.peso.gov.in/','PESO'),
 'DATA_CYBER':('MeitY / CERT-In / Data Protection Board as applicable','https://www.meity.gov.in/','DPDP'), 'NGO':('State registrar / MHA FCRA / MCA as applicable','https://fcraonline.gov.in/','FCRA')}
for did,n,c in DEPTS:
    auth,url,sid=PORTALS.get(did,(n+' - jurisdiction-specific authority','https://www.nsws.gov.in/','NSWS_FAQ'))
    add('authorities',authority_id='AUTH-'+did,name=auth,jurisdiction_id='IN',website_url=url,source_id=sid,verification_status='routing_reference')

def parse_triggers(text):
    cleaned=text.lower().replace('director/partner','director_partner').replace('director / partner','director_partner')
    return [tid for tid,_,_ in TRIGGERS if tid.replace('_',' ') in cleaned or tid in cleaned] or ['industry']

def entity_map(text):
    text=text.lower()
    if any(x in text for x in ['all entities','all businesses','gst registered','gst-registered','all employers','all entity']):
        return [x[0] for x in ENTITIES]
    patterns={'sole_proprietor':['sole','proprietor','individual'], 'partnership':['partnership','firm'], 'llp':['llp'], 'private_company':['pvt','private'], 'public_company':['public'], 'trust':['trust'], 'society':['societ'], 'section8':['section 8','sec 8']}
    found=[k for k,v in patterns.items() if any(s in text for s in v)]
    if 'compan' in text and not any(x in found for x in ['private_company','public_company']): found+=['private_company','public_company','section8']
    if 'ngo' in text: found+=['trust','society','section8']
    return sorted(set(found)) or [x[0] for x in ENTITIES]

def department_for(i,row):
    if i<=14 or i==91 or i in [103,104]: return 'GST'
    if i in [30,31,92,93]: return 'AUDIT'
    if i in [32,33,34]: return 'LLP'
    if i in [36,37,38,39,40,45]: return 'NGO'
    if i==35 or 41<=i<=44 or 46<=i<=52 or i in [105,106]: return 'INCOME_TAX'
    if 53<=i<=62: return 'TDS_TCS'
    if i in [63,64,65,107]: return 'EPFO'
    if i in [66,67]: return 'ESIC'
    if i in [68,69]: return 'PT'
    if i==70: return 'POSH'
    if i==72: return 'LWF'
    if i in [71,73,74]: return 'LABOUR'
    if 75<=i<=77: return 'FSSAI'
    if 78<=i<=82: return 'DGFT'
    if i==83: return 'MSME'
    if i==84: return 'MUNICIPAL'
    if i==85: return 'FIRE'
    if i in [86,87]: return 'FACTORY'
    if i in [88,89]: return 'POLLUTION'
    if i==90: return 'WASTE'
    if 94<=i<=98: return 'IP'
    if 99<=i<=102: return 'BOOKS'
    return 'MCA'

def new_rule(code,name,dept,law,applies,deadline,triggers,documents='',jur='IN',scope='central',kind='mandatory_if_applicable',entities=None,turnover='',employees='',frequency='event_based',sources=None,website='',mode='unverified',physical='unverified',visit='unverified',inspection='unverified',testing='unverified',notes='',effective='',tax_period='',expression=None,deadline_json=None,status='researched_partial'):
    cid=code; rid=code+'-V1'
    add('compliances',compliance_id=cid,name=name,department_id=dept,obligation_kind=kind,scope_level=scope,catalog_status=status)
    add('rule_versions',rule_id=rid,compliance_id=cid,jurisdiction_id=jur,authority_id='AUTH-'+dept,governing_law=law,applicability_text=applies,turnover_basis=turnover,employee_basis=employees,effective_from=effective,tax_period=tax_period,frequency=frequency,deadline_text=deadline,deadline_json=json.dumps(deadline_json or {'type':'manual_review'},ensure_ascii=False),exceptions_text=notes,verification_status=status,automation_enabled=0,checked_on=ASOF)
    for tid in triggers: add('rule_triggers',rule_trigger_id=rid+'-'+tid,rule_id=rid,trigger_id=tid)
    for eid in entities or [x[0] for x in ENTITIES]: add('rule_entities',rule_entity_id=rid+'-'+eid,rule_id=rid,entity_type_id=eid,mapping_status='candidate_filter_not_final_eligibility')
    if expression:
        facts=set()
        def walk(e):
            if 'field' in e: facts.add(e['field'])
            for k in ['all','any']:
                for c in e.get(k,[]): walk(c)
        walk(expression)
        add('applicability_conditions',condition_id=rid+'-COND',rule_id=rid,expression_json=json.dumps(expression),expression_status='candidate_condition_requires_full_rule_review',required_facts_json=json.dumps(sorted(facts)),notes='Missing facts evaluate to unknown; this condition alone must not activate the rule')
    # Keep original compound lists intact; do not split document names at arbitrary commas.
    if documents: add('document_requirements',document_id=rid+'-DOC',rule_id=rid,document_name=documents,requirement_status='indicative_checklist',condition_text='Check the current form and exact applicant/activity before collecting documents')
    add('process_profiles',process_id=rid+'-PROCESS',rule_id=rid,application_url=website,url_role='application_or_guidance' if website else 'not_resolved',filing_mode=mode,physical_submission=physical,applicant_visit=visit,inspection=inspection,testing_or_notarisation=testing,process_notes=notes or 'Filing channel and physical requirements require independent evidence.',verification_status='researched_partial' if mode!='unverified' else 'unverified')
    for sid,field,finding in sources or []:
        add('evidence_assertions',assertion_id=rid+'-E'+str(sum(x['rule_id']==rid for x in TABLES['evidence_assertions'])+1),rule_id=rid,source_id=sid,field_name=field,finding=finding,verification_status='supported_within_source_scope')
    return rid

legacy_master=list(csv.DictReader((ROOT/'inputs/india_compliance_master.csv').open(encoding='utf-8-sig',newline='')))
legacy_states=list(csv.DictReader((ROOT/'inputs/india_state_compliance_matrix.csv').open(encoding='utf-8-sig',newline='')))
for i,row in enumerate(legacy_master,1):
    cid=f'C{i:03d}' if i!=91 else 'C008'
    add('legacy_rows',legacy_row_id=f'M{i:03d}',input_file='india_compliance_master.csv',input_row_number=i+1,mapped_compliance_id=cid,raw_json=json.dumps(row,ensure_ascii=False))
    if i==91:
        add('correction_log',correction_id='FIX-DUP-GSTR9C',legacy_row_id='M091',field_name='Compliance_Name',original_value=row['Compliance_Name'],replacement_or_action='Merged into C008; GSTR-9C is not a separate second GST audit',status='duplicate_resolved')
        continue
    dept=department_for(i,row)
    scope='state_framework' if i in [36,37,38,39,68,69,72,84,85,86,87,88,89,90] else 'central'
    kind='optional_benefit' if i in [80,83,94,96,97,98] else 'mandatory_if_applicable'
    new_rule(cid,row['Compliance_Name'],dept,row['Governing_Law'],row['Applicable_Entity_Types'],row['Due_Date_Timeline'],parse_triggers(row['Trigger_Type']),row['Key_Documents_Required'],scope=scope,kind=kind,entities=entity_map(row['Applicable_Entity_Types']),turnover=row['Turnover_Applicability'],employees=row['Employee_Headcount_Threshold'],frequency=row['Frequency'],notes='Imported rule: unresolved fields require verification. Original notes, process claims and penalties are preserved unchanged in legacy_rows.',status='imported_unverified')

def patch_legacy(i,sid,field,new,reason):
    rid=f'C{i:03d}-V1'
    rule=next(x for x in TABLES['rule_versions'] if x['rule_id']==rid)
    original=rule.get(field,'')
    rule[field]=new; rule['verification_status']='researched_partial'
    add('correction_log',correction_id=f'FIX-{i}-{field}',legacy_row_id=f'M{i:03d}',field_name=field,original_value=original,replacement_or_action=new,source_id=sid,status='corrected_or_qualified')
    add('evidence_assertions',assertion_id=f'{rid}-FIX-{field}',rule_id=rid,source_id=sid,field_name=field,finding=reason,verification_status='supported_within_source_scope')

def evidence(i,sid,field,finding):
    rid=f'C{i:03d}-V1'
    add('evidence_assertions',assertion_id=f'{rid}-{sid}-{field}',rule_id=rid,source_id=sid,field_name=field,finding=finding,verification_status='supported_within_source_scope')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['verification_status']='researched_partial'

def process(i,url,mode='online',physical='unverified',visit='unverified',inspection='unverified',notes=''):
    p=next(x for x in TABLES['process_profiles'] if x['rule_id']==f'C{i:03d}-V1')
    p.update(application_url=url,url_role='application_or_guidance',filing_mode=mode,physical_submission=physical,applicant_visit=visit,inspection=inspection,process_notes=notes,verification_status='researched_partial')

exec((ROOT/'research/central_updates.py').read_text(encoding='utf-8'))
exec((ROOT/'research/additional_compliances.py').read_text(encoding='utf-8'))
exec((ROOT/'research/state_layer.py').read_text(encoding='utf-8'))
exec((ROOT/'research/indiafilings_updates.py').read_text(encoding='utf-8'))
exec((ROOT/'research/assets_licences_updates.py').read_text(encoding='utf-8'))
exec((ROOT/'research/finalize_catalog.py').read_text(encoding='utf-8'))

PROFILE = [
 ('entity_type','enum','legal_entity','Legal form, separate from charitable/tax registration status','All'),('financial_year','string','period','Relevant reporting year; distinguish FY/AY from new Tax Year','All'),('pan_aggregate_turnover_inr','decimal','PAN/year','GST aggregate turnover across India; not profit or only this branch sales','GST'),('gst_max_aato_since_2017_inr','decimal','PAN/history','Maximum aggregate turnover in any relevant preceding FY since 2017-18','E-invoice'),('business_turnover_inr','decimal','entity/year','Income-tax business sales/turnover/gross receipts','Tax audit'),('professional_receipts_inr','decimal','entity/year','Gross professional receipts separate from business turnover','Tax audit'),('cash_receipts_pct','decimal','entity/year','Cash receipts percentage 0-100 using statutory definition','Tax audit'),('cash_payments_pct','decimal','entity/year','Cash payment percentage 0-100 using statutory definition','Tax audit'),('paid_up_capital_inr','decimal','entity/date','Paid-up share capital; not authorised capital','MCA'),('bank_pfi_borrowings_inr','decimal','entity/date','Outstanding borrowings; maximum during relevant year where prescribed','Audit'),('net_worth_inr','decimal','entity/year','Statutory net worth','CSR'),('net_profit_inr','decimal','entity/year','Statutory profit calculation','CSR'),('company_turnover_inr','decimal','entity/year','Turnover per applicable Companies Act rule','MCA/TReDS'),('is_cpse','boolean','entity','Central public-sector enterprise status','TReDS'),('msme_investment_inr','decimal','PAN/year','Investment in plant/machinery/equipment under MSME definition','Udyam'),('msme_turnover_ex_exports_inr','decimal','PAN/year','MSME statutory turnover excluding exports','Udyam'),('food_turnover_inr','decimal','food_business/year','Turnover for relevant FoSCoS classification','FSSAI'),('food_kob','enum','premises/activity','FoSCoS kind of business including mandatory licence categories','FSSAI'),('special_fssai_category','boolean','premises/activity','Whether category overrides ordinary turnover tier','FSSAI'),('worker_count','integer','establishment/date','Count under relevant labour law; include lookback history','Labour'),('employee_count','integer','establishment/date','Count under rule-specific employee definition','EPF/ESI/POSH'),('contract_worker_count','integer','establishment/12months','Contract labour threshold with statutory reference period','OSH'),('uses_power','boolean','premises','Manufacturing with aid of power','Factory'),('monthly_wages_inr','decimal','worker/month','Rule-specific wage definition, not assumed gross CTC','EPFO/ESIC/PT'),('state_ut','enum','establishment','State/UT location for each establishment','State rules'),('local_body_id','string','premises','Municipality/panchayat/authority and ward; PIN code alone is insufficient','Municipal/PT'),('gst_registered','boolean','GSTIN','Registration status and category per GSTIN','GST returns'),('e_invoice_exempt','boolean','entity/activity','Exempt supplier class under current notifications','E-invoice'),('estimated_net_tax_inr','decimal','entity/tax_year','Estimated advance tax liability after applicable credits','Advance tax'),('is_exempt_senior_citizen','boolean','person/tax_year','Resident senior citizen with no business/professional income','Advance tax'),('industry_activities','array','premises','All relevant activities/products; multiple allowed','Industry'),('pollution_category','enum','premises','Current SPCB classification and consent exemption','Environment'),('licence_expiry','date','licence','Actual certificate expiry, where expiry applies','Renewal'),('notice_received_at','datetime','case','Service timestamp and method','Notices'),('notice_deadline','datetime','case','Deadline in actual notice/order','Notices'),('transaction_date','date','transaction','Actual transaction trigger date','Transaction'),('agm_date','date','entity/year','Actual AGM date; separately record statutory last date','MCA'),('incorporation_date','date','entity','Incorporation date and first financial-year end','MCA/LLP'),('foreign_investment','boolean','entity/transaction','Foreign investment/inward or outward position','FEMA'),('voluntary_scheme_elected','boolean','entity/scheme','Optional scheme chosen; never infer mandatory applicability','Optional benefits'),('is_presumptive_eligible','boolean','entity/year','Eligibility under the exact presumptive provision','Tax audit'),('is_presumptive_compliant','boolean','entity/year','Correctly declares statutory presumptive income','Tax audit')]
for fid,dt,scope,desc,req in PROFILE: add('business_profile_fields',field_id=fid,data_type=dt,scope=scope,description=desc,required_for=req)

def write_csv(path,rows,cols):
    with path.open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=cols,lineterminator='\r\n',extrasaction='raise')
        w.writeheader(); w.writerows(rows)

def sql_schema():
    chunks=['-- Portable SQL: SQLite-tested. PostgreSQL-compatible base types.\n-- Run in a dedicated staging schema/database. No DROP or production mutation.\n']
    for t in TABLE_ORDER:
        cols=SCHEMA[t]
        defs=[]
        for i,col in enumerate(cols):
            n,typ=col[:2]
            s=f'  {n} {typ}' + (' PRIMARY KEY NOT NULL' if i==0 else '')
            if len(col)==3:
                rt,rc=col[2].split('.'); s+=f' REFERENCES {rt}({rc})'
            if n=='automation_enabled': s+=' NOT NULL DEFAULT 0 CHECK (automation_enabled IN (0,1))'
            if n in ['min_inclusive','max_inclusive']: s+=f' CHECK ({n} IN (0,1))'
            defs.append(s)
        if t=='rule_versions': defs+=['  CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)','  UNIQUE (compliance_id,jurisdiction_id,tax_period,effective_from)']
        if t=='rule_triggers': defs+=['  UNIQUE (rule_id,trigger_id)']
        if t=='rule_entities': defs+=['  UNIQUE (rule_id,entity_type_id)']
        if t=='process_profiles': defs+=['  UNIQUE (rule_id)']
        if t=='state_coverage': defs+=['  UNIQUE (jurisdiction_id,topic)']
        if t=='coverage_rules': defs+=['  UNIQUE (coverage_id,rule_id)']
        if t=='field_reviews': defs+=['  UNIQUE (rule_id,field_name)']
        if t=='state_property_profiles': defs+=['  UNIQUE (jurisdiction_id)']
        if t=='rule_asset_scopes': defs+=['  UNIQUE (rule_id,asset_class_id,actor_role)']
        chunks.append(f'CREATE TABLE {t} (\n'+',\n'.join(defs)+'\n);\n')
    chunks.append('CREATE INDEX rule_jurisdiction_idx ON rule_versions(jurisdiction_id,compliance_id);\nCREATE INDEX rule_trigger_idx ON rule_triggers(trigger_id,rule_id);\nCREATE INDEX evidence_rule_idx ON evidence_assertions(rule_id);\n')
    return '\n'.join(chunks)

OUT.mkdir(exist_ok=True)
# Synchronise catalog state from actual version evidence.
for c in TABLES['compliances']:
    rv=[r for r in TABLES['rule_versions'] if r['compliance_id']==c['compliance_id']]
    c['catalog_status']='researched_partial' if any(r['verification_status']=='researched_partial' for r in rv) else rv[0]['verification_status']
for t,rows in TABLES.items(): write_csv(OUT/(t+'.csv'),rows,[c[0] for c in SCHEMA[t]])
(OUT/'schema.sql').write_text(sql_schema(),encoding='utf-8')

# Flat review export: one row per rule version, not a Cartesian product.
flat=[]
for r in TABLES['rule_versions']:
    cid=r['compliance_id']; rid=r['rule_id']
    c=next(c for c in TABLES['compliances'] if c['compliance_id']==cid)
    p=next(p for p in TABLES['process_profiles'] if p['rule_id']==rid)
    ev=[e for e in TABLES['evidence_assertions'] if e['rule_id']==rid]
    flat.append(dict(r,compliance_name=c['name'],department_id=c['department_id'],obligation_kind=c['obligation_kind'],scope_level=c['scope_level'],trigger_types='|'.join(x['trigger_id'] for x in TABLES['rule_triggers'] if x['rule_id']==rid),entity_types='|'.join(x['entity_type_id'] for x in TABLES['rule_entities'] if x['rule_id']==rid),documents=' | '.join(x['document_name'] for x in TABLES['document_requirements'] if x['rule_id']==rid),application_url=p['application_url'],filing_mode=p['filing_mode'],physical_submission=p['physical_submission'],applicant_visit=p['applicant_visit'],inspection=p['inspection'],process_notes=p['process_notes'],source_urls='|'.join(dict.fromkeys(next(s['url'] for s in TABLES['sources'] if s['source_id']==e['source_id']) for e in ev))))
write_csv(OUT/'india_compliance_master.csv',flat,list(flat[0]))
write_csv(OUT/'indiafilings_additions.csv',[r for r in flat if r['compliance_id'].startswith('IF')],list(flat[0]))
write_csv(OUT/'indiafilings_gap_review.csv',IF_SCAN,list(IF_SCAN[0]))
write_csv(OUT/'investment_property_licence_additions.csv',[r for r in flat if r['compliance_id'].startswith('AX')],list(flat[0]))
state_review=[]
for cov in TABLES['state_coverage']:
    ids=[x['rule_id'] for x in TABLES['coverage_rules'] if x['coverage_id']==cov['coverage_id']]
    ps=[p for p in TABLES['process_profiles'] if p['rule_id'] in ids]
    row=dict(cov,linked_rule_ids='|'.join(ids))
    for field in ['filing_mode','physical_submission','applicant_visit','inspection','testing_or_notarisation']:
        row[field]='|'.join(dict.fromkeys(p[field] for p in ps)) if ps else 'unverified'
    row['documents']=' | '.join(d['document_name'] for d in TABLES['document_requirements'] if d['rule_id'] in ids)
    row['procedure_urls']='|'.join(dict.fromkeys(p['application_url'] for p in ps if p['application_url']))
    state_review.append(row)
write_csv(OUT/'india_state_compliance_matrix.csv',state_review,list(state_review[0]))

# Validate actual CSV round trip, SQL load, referential integrity and data-specific invariants.
db=sqlite3.connect(':memory:'); db.execute('PRAGMA foreign_keys=ON'); db.executescript(sql_schema())
# Deferred order: jurisdictions references are documented; sources are loaded before authorities.
order=TABLE_ORDER
for t in order:
    cols=[c[0] for c in SCHEMA[t]]
    loaded=list(csv.DictReader((OUT/(t+'.csv')).open(encoding='utf-8',newline='')))
    assert len(loaded)==len(TABLES[t]),t
    for row in loaded:
        vals=[None if row[c]=='' else row[c] for c in cols]
        db.execute(f'INSERT INTO {t} VALUES ({",".join("?" for _ in cols)})',vals)
    for col in cols:
        if col.endswith('_json'):
            for row in loaded:
                if row[col]: json.loads(row[col])
assert not db.execute('PRAGMA foreign_key_check').fetchall()
assert len(STATES)==36 and len({s[0] for s in STATES})==36
assert len(DEPTS)==39 and len(TRIGGERS)==10
assert len(legacy_master)==108 and len(legacy_states)==25
assert len({r['rule_id'] for r in flat})==len(flat)
assert all(r['automation_enabled']==0 for r in TABLES['rule_versions'])
assert 'C091' not in {c['compliance_id'] for c in TABLES['compliances']}
for code,_,_ in STATES:
    assert any(r['jurisdiction_id']=='IN-'+code for r in TABLES['state_coverage'])
for r in TABLES['rule_triggers']: assert r['trigger_id'] in {x[0] for x in TRIGGERS}
for n in [0,1999999,2000000,3999999,4000000,14999999,15000000,49999999,50000000,500000000,500000001]:
    matches=[b for b in TABLES['turnover_bands'] if (n>=b['min_inr'] if b['min_inclusive'] else n>b['min_inr']) and (b['max_inr']=='' or (n<=b['max_inr'] if b['max_inclusive'] else n<b['max_inr']))]
    assert len(matches)==1,('band boundary',n)
manifest={'research_as_of':ASOF,'release_status':'RESEARCH_STAGING_NOT_EXHAUSTIVE','schema_validation':'SQLite in-memory CSV import and foreign-key checks passed','production_database_modified':False,'states_uts':36,'department_groups':36,'trigger_types':10,'compliance_definitions':len(TABLES['compliances']),'rule_versions':len(TABLES['rule_versions']),'state_topic_coverage_rows':len(TABLES['state_coverage']),'source_count':len(TABLES['sources']),'automated_rules':0,'rule_verification_counts':dict(Counter(r['verification_status'] for r in TABLES['rule_versions'])),'coverage_counts':dict(Counter(r['coverage_status'] for r in TABLES['state_coverage'])),'csv_row_counts':{k:len(v) for k,v in TABLES.items()},'inputs':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'inputs').glob('*.csv')}}
manifest.update(data_release='1.2.0',department_groups=len(DEPTS),base_research_as_of=ASOF,research_as_of=SCAN_DATE,indiafilings_additions=16,indiafilings_reviewed_topics=len(IF_SCAN),asset_licence_additions=len(ASSET_ADDITIONS))
(OUT/'validation_report.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
(OUT/'schema.json').write_text(json.dumps({'schema_version':'1.1.0','import_order':order,'tables':{t:[{'name':c[0],'sql_type':c[1],'primary_key':i==0,'references':c[2] if len(c)>2 else None} for i,c in enumerate(cols)] for t,cols in SCHEMA.items()}},indent=2),encoding='utf-8')
print(json.dumps(manifest,indent=2))
