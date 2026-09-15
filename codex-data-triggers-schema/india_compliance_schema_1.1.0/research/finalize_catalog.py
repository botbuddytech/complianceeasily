# Final review corrections and machine-readable candidates. No rule is enabled by this script.
names={23:'Director DIN KYC / particulars update',54:'Quarterly salary TDS statement',55:'Quarterly resident non-salary TDS statement',56:'Quarterly non-resident TDS statement',57:'Quarterly TCS statement',60:'Specified property payment deduction and statement',61:'Foreign remittance information / accountant certificate',50:'Income-tax audit report'}
for i,n in names.items(): next(c for c in TABLES['compliances'] if c['compliance_id']==f'C{i:03d}')['name']=n
forms={2:'GSTR-1',3:'GSTR-3B',4:'PMT-06',5:'CMP-08',6:'GSTR-4',7:'GSTR-9',8:'GSTR-9C',9:'GSTR-7',10:'GSTR-8',13:'RFD-11',17:'INC-20A',19:'ADT-1',20:'AOC-4 (variant depends on company)',21:'MGT-7 / MGT-7A',23:'DIR-3-KYC-Web / current Rule 12A form',24:'DPT-3',25:'MSME-1',26:'CHG-1',27:'PAS-3',28:'DIR-12',29:'INC-22',33:'LLP-11',34:'LLP-8',35:'ITR-5',43:'10B / 10BB',44:'ITR-7',50:'3CA / 3CB with 3CD',51:'3CEB',54:'24Q',55:'26Q',56:'27Q',57:'27EQ',58:'16',59:'16A',60:'26QB',61:'15CA / 15CB',62:'61A'}
for i,f in forms.items(): next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V1')['form_code']=f
for i,f in [(54,'138'),(55,'140'),(56,'144'),(57,'143'),(61,'145 / 146'),(50,'26'),(60,'141')]: next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V2')['form_code']=f

# The original generic partnership registration belongs to the business-registration group.
for i in [36,37]: next(c for c in TABLES['compliances'] if c['compliance_id']==f'C{i:03d}')['department_id']='MCA'
next(c for c in TABLES['compliances'] if c['compliance_id']=='C036')['obligation_kind']='conditional_registration_or_legal_effect'
next(r for r in TABLES['rule_versions'] if r['rule_id']=='C036-V1')['exceptions_text']='State amendments and consequences of non-registration must be evaluated; do not automatically treat registration as uniformly compulsory or unnecessary.'
for i in [68,69,72,84,85,88,89,90]:
    r=next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V1')
    r['exceptions_text']='National framework/discovery entry only. Resolve state/local authority, rule, exemption, deadline and procedure; linked state coverage identifies gaps.'
    if i==68: r['deadline_text']='State-specific statutory registration period from liability; do not assume one India-wide 30-day deadline.'
    if i==84: r['deadline_text']='Before covered trade where required; actual certificate/local rules control renewal. No universal start-of-FY renewal date.'
    if i==90: r['deadline_text']='Obtain authorisation when prescribed for the activity; do not assume consent to operate substitutes for waste authorisation.'
for i in [104,105,106,107,108]:
    next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V1')['deadline_text']='Use actual notice/order, legal provision, period, service date and applicable extension. No universal reply deadline assigned.'

# Exact candidate calendars are deliberately separate from activation and period extensions.
for rid,expr in [
 ('C002-V1',{'type':'selected_calendar','choices':[{'when':'monthly_filer','period':'month','month_offset':1,'day':11},{'when':'quarterly_filer','period':'quarter','month_offset':1,'day':13}],'source_id':'GST_1'}),
 ('C006-V1',{'type':'year_end_offset','month_offset':3,'day':30,'period_basis':'financial_year_end','applies_from_fy':'2024-25','source_id':'GST_4'}),
 ('C020-V1',{'type':'event_offset','event':'agm_date','days':30,'exception_review':['OPC','AGM_not_held','unadopted_accounts'],'source_id':'MCA_ACT'}),
 ('C021-V1',{'type':'event_offset','event':'agm_or_statutory_last_date','days':60,'exception_review':['OPC','other_exemptions'],'source_id':'MCA_ACT'}),
 ('C034-V1',{'type':'year_end_offset_then_days','month_offset':6,'days':30,'period_basis':'financial_year_end','source_id':'LLP_8'}),
 ('C064-V1',{'type':'period_offset','period':'month','month_offset':1,'day':15,'applies_to':'contribution_payment','source_id':'EPF_DUE'}),
 ('C079-V1',{'type':'calendar_annual','month':6,'day':30,'source_id':'DGFT_FTP'}),
 ('N007-V1',{'type':'year_end_months','month_offset':9,'period_basis':'financial_year_end','source_id':'FCRA'}),
 ('N009-V1',{'type':'fixed_date','date':'2026-05-31','period_key':'FY2025-26','source_id':'FSSAI_RETURN'}),
 ('N037-V1',{'type':'event_hours','event':'incident_noticed_or_brought_to_notice_at','hours':6,'source_id':'CERT'})]:
    expr.update(timezone='Asia/Kolkata',status='candidate_requires_full_applicability_and_extension_review')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['deadline_json']=json.dumps(expr)

for doc in TABLES['document_requirements']: doc['entry_kind']='compound_checklist'

# Field-level review does not upgrade an entire row because one portal is known.
for r in TABLES['rule_versions']:
    rid=r['rule_id']; ev=[e for e in TABLES['evidence_assertions'] if e['rule_id']==rid]
    for field in ['governing_law','applicability_text','turnover_basis','employee_basis','deadline_text','documents','application_url','filing_mode','physical_submission','applicant_visit','inspection']:
        links=[e['assertion_id'] for e in ev if e['field_name']==field]
        status='source_scoped_partial' if links else 'not_independently_verified'
        add('field_reviews',review_id=rid+'-'+field,rule_id=rid,field_name=field,review_status=status,evidence_ids_json=json.dumps(links),review_note='Read assertion scope and source; a framework or portal citation is not complete field verification. All automation remains disabled.')
