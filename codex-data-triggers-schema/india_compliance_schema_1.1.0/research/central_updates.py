# Executed by build_dataset.py. Imported source text is evidence, never instructions.
source('EPF_ECR','https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2012-2013/NDC_ECR.pdf','EPFO ECR implementation circular','ECR replaces separate routine monthly/annual paper returns','notification')
source('DIN_2026','https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210552&lang=2&reg=48','MCA director KYC reform 1 January 2026','Three-year KYC cycle from 31 March 2026','official_release')
source('GST_BIO','https://www.mahagst.gov.in/public/uploads/gstnadvisory/1760597425_330%20Advisory%20for%20GST%20Registration%20Process%20%28Rule%208%20of%20CGST%20Rules%2C%202017%29.pdf','GST registration biometric advisory','GSK visit and original-document verification in identified cases','guidance')
source('POSH_ACT','https://www.indiacode.nic.in/bitstream/123456789/2104/1/A2013-14.pdf','POSH Act 2013','Internal Committee, employer duties and annual reporting','statute')
source('FORM141','https://www.incometaxindia.gov.in/documents/d/guest/form-141-faqs','Income-tax Form 141 FAQs','Replaces old 26QB/26QC/26QD/26QE for relevant new-law periods','guidance')

patch_legacy(1,'GST_ECO','applicability_text','GST liability depends on supply type, state, PAN aggregate turnover and compulsory-registration exceptions. Do not treat every interstate service supplier or every e-commerce seller as compulsorily registrable. Notification 34/2023 gives qualifying unregistered goods sellers through ECOs an exemption.','The original unconditional e-commerce claim is overbroad.')
patch_legacy(1,'GST_ECO','turnover_basis','PAN aggregate turnover across India; ordinary goods/services limits are subject to specified states, products, exclusions and section 24 exceptions. Exact state/supply evaluation required.','Turnover alone is insufficient.')
process(1,'https://www.gst.gov.in/','online_with_conditional_physical_step','conditional','conditional','conditional','Applicants selected for biometric/document verification, or not choosing Aadhaar authentication, may need a GSK visit with originals. Premises verification is a separate process.')
evidence(1,'GST_BIO','applicant_visit','GSK visit applies to specified authentication cases.')
for i,sid in [(2,'GST_1'),(3,'GST_3B'),(6,'GST_4_FORM'),(7,'GST_9'),(8,'GST_9')]:
    process(i,'https://www.gst.gov.in/','online',notes='Return submission online; a later audit or notice is a separate process.')
    evidence(i,sid,'filing_mode','Online return process documented.')
patch_legacy(2,'GST_1','deadline_text','Monthly: 11th of following month. Quarterly: 13th after quarter end. Apply notified period-specific extensions.','Guide supplies monthly and quarterly dates.')
patch_legacy(6,'GST_4','deadline_text','30 June following financial-year end, from FY 2024-25 onwards; check period-specific extensions.','30 June replaced 30 April.')
patch_legacy(6,'GST_4','tax_period','FY 2024-25 onwards','Revised deadline applicability period.')
patch_legacy(11,'EINV','turnover_basis','Aggregate turnover exceeding INR 50000000 in a relevant preceding FY since 2017-18, subject to exempt supplier classes and covered documents.','Threshold is more than INR 5 crore, not at least INR 5 crore.')
patch_legacy(11,'EINV_30','deadline_text','Generate IRN within the applicable invoice requirements; AATO >= INR 100000000 has a 30-day portal reporting restriction from 1 April 2025. This is not permission to issue a required e-invoice without an IRN.','Separate mandate threshold from portal age restriction.')
process(11,'https://einvoice6.gst.gov.in/','online',notes='IRP route; supplier/document exemptions require checking.')

for i in [15,16,17,19,20,21,23,24,25,26,27,28,29,32,33,34,40,108]:
    process(i,'https://www.mca.gov.in/','online',notes='MCA21 electronic filing route. DSC, execution, foreign-document notarisation/apostille and hearing requirements depend on form and applicant; not verified here.')
    evidence(i,'MCA_PORTAL','application_url','MCA21 filing route.')
patch_legacy(20,'MCA_ACT','deadline_text','Section 137: ordinarily within 30 days of AGM; special handling for no AGM, unadopted accounts and OPC. Determine actual due date from applicable company facts.','Section 137 is event-based; do not hard-code 30 October for every company.')
patch_legacy(21,'MCA_ACT','deadline_text','Within 60 days of AGM or the date it should have been held, as applicable; exemptions/special entity rules require checking.','Annual-return deadline depends on AGM facts.')
patch_legacy(21,'MCA_SMALL','exceptions_text','Select MGT-7A only where OPC/small-company rules apply. From 1 December 2025, small-company prescribed capital and turnover limits are INR 10 crore and INR 100 crore; statutory exclusions still apply, including public, holding/subsidiary and Section 8 companies.','Do not infer small-company status from turnover alone.')
patch_legacy(23,'DIN_2026','frequency','three_year_cycle_plus_event_updates','Annual KYC replaced by triennial intimation.')
patch_legacy(23,'DIN_2026','deadline_text','From 31 March 2026: new three-year KYC framework. Directors with KYC already completed as described in the announcement next file by 30 June 2028. Determine first-filing and changed-details requirements from current Rule 12A.','Do not schedule blanket annual 30 September reminders.')
patch_legacy(23,'DIN_2026','effective_from','2026-03-31','New KYC framework commencement.')
patch_legacy(30,'MCA_ACT','turnover_basis','Company statutory audit is not conditional on a minimum turnover; company-specific exemptions and auditor rules still require checking.','Company audit is not a turnover-breach-only obligation.')
for x in TABLES['rule_triggers']:
    if x['rule_id']=='C030-V1': x.update(rule_trigger_id='C030-V1-date',trigger_id='date')
patch_legacy(34,'LLP_8','deadline_text','Within 30 days after the end of six months from financial-year close; ordinarily 30 October for a 31 March close. Check first-FY and notified extension rules.','Form 8 event timeline verified.')
patch_legacy(92,'MCA_ACT','turnover_basis','Apply Companies (Accounts) Rules Rule 13 separately to listed, unlisted public and private companies. The imported assertion that private companies trigger at INR 50 crore paid-up capital is not accepted; verify turnover and bank/PFI borrowing tests in the current rule.','Section 138 delegates applicable classes to rules; imported conflation held for correction.')

# Older tax forms remain usable for older periods; do not rewrite their form numbers globally.
tax_legacy=[35,41,42,43,44,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,101,105,106]
for i in tax_legacy:
    r=next(x for x in TABLES['rule_versions'] if x['rule_id']==f'C{i:03d}-V1')
    r['tax_period']='1961 Act periods / AY through 2026-27; check transitional provisions'
    evidence(i,'IT_2025','tax_period','Old/new law transition requires period selection.')
    process(i,'https://www.incometax.gov.in/','online',notes='Electronic services available; exact form, signatures and alternative filing routes require applicant/period review.')
patch_legacy(48,'IT_RETURNS','deadline_text','AY 2026-27: do not use one date for every non-audit taxpayer. Official guidance distinguishes 31 July and 31 August categories. Resolve business/professional income, entity type and applicable extensions before scheduling.','Blanket non-audit 31 July rule removed.')
patch_legacy(49,'IT_AUDIT','exceptions_text','Income-tax audit, statutory audit and transfer-pricing categories have distinct return deadlines. An audit-report deadline is not the ITR deadline.','Separate reporting obligations.')
patch_legacy(50,'IT_AUDIT','turnover_basis','Business: above INR 10000000, or above INR 100000000 where BOTH cash receipts and cash payments do not exceed 5%. Profession: general audit threshold above INR 5000000. Eligible presumptive professional treatment up to INR 7500000 can relieve audit only if all conditions are met; it is not a universal digital-receipts audit threshold.','Corrects conflation of professional audit and presumptive thresholds.')
patch_legacy(50,'IT_AUDIT','deadline_text','For FY 2025-26 / AY 2026-27, Forms 3CA/3CB + 3CD; ordinary audit-report due date 30 September 2026, subject to category and extensions. New Tax Year 2026-27 uses Form 26.','Preserve old forms for old FY.')
patch_legacy(52,'IT_ADVANCE','turnover_basis','Estimated net advance-tax liability >= INR 10000, after applicable credits and exemptions; this is a tax-liability threshold, not turnover.','Equality at INR 10000 matters.')
patch_legacy(56,'IT_FORMS','governing_law','Income-tax Act 1961 for legacy periods; Form 27Q maps to Form 144 under the Income-tax Rules 2026, not Form 139.','Official form directory corrects imported mapping.')
patch_legacy(60,'FORM141','exceptions_text','Legacy Form 26QB applies to relevant old-law transactions. New-law specified transactions use Form 141; select its property schedule and current conditions.','Old/new transaction form mapping.')
for i in [54,55,57,61]: evidence(i,'IT_FORMS','form_mapping','Old/new form pairing appears in official directory.')

for i in [63,64,65,66,67,71,73,74,86,87,107]:
    r=next(x for x in TABLES['rule_versions'] if x['rule_id']==f'C{i:03d}-V1')
    original=r['governing_law']
    patch_legacy(i,'LABOUR_CODES','governing_law',original+' [Legacy reference]. Review operative Labour Code, current rules/schemes and savings from 21 November 2025; do not use legacy law alone.','Four labour codes commenced; implementing rules must be mapped.')
patch_legacy(64,'EPF_DUE','deadline_text','Ordinary monthly PF payment due by 15th of following month. Treat ECR extensions and contribution-payment extensions separately.','PF payment deadline is distinct from a filing-only extension.')
process(64,'https://www.epfindia.gov.in/','online','not_required','not_required','not_applicable','Online ECR replaces routine paper returns; investigations are separate obligations.')
evidence(64,'EPF_ECR','physical_submission','Routine paper-return requirement replaced by ECR.')
patch_legacy(65,'EPF_ECR','applicability_text','Do not create a routine separate annual Form 3A/6A filing for ECR-compliant employers. Retain this entry for historical records or a specific correction/departmental requirement.','Monthly ECR replaced separate routine returns.')
patch_legacy(65,'EPF_ECR','frequency','legacy_or_specific_request','No generic annual task should be generated.')
patch_legacy(65,'EPF_ECR','deadline_text','No routine separate annual deadline assigned; use actual departmental request if applicable.','Remove generic annual reminder.')
patch_legacy(66,'LABOUR_SSC','employee_basis','Establishment coverage and exceptions must be tested separately. Current notified ESI employee wage ceiling cited by ministry: INR 21000 per month; use Code wage definition and applicable special categories.','Wage ceiling is not the establishment headcount trigger.')
evidence(67,'ESI_RATES','contribution_rates','Ordinary rates: employer 3.25%; employee 0.75%; exceptions apply.')
patch_legacy(70,'POSH_ACT','deadline_text','Constitute Internal Committee where required. Annual report goes to employer and District Officer; no universal 31 January due date is imposed by the central Act. Check local instructions.','Do not invent an India-wide report date.')
patch_legacy(71,'LABOUR_SSC','exceptions_text','Fixed-term employment means directly employed under a fixed-term contract, not contractor-supplied labour; ministry FAQ recognises one-year service eligibility under that contract. Other gratuity coverage and entitlement rules need separate evaluation.','Employee class matters.')
patch_legacy(74,'OSH_RULES','employee_basis','Re-evaluate contract-labour coverage under OSH Code and appropriate-government rules. Do not continue the imported universal 20-worker licence test. Contractor licence and principal-employer obligations are separate.','Legacy threshold is not accepted as a current universal rule.')
for i in [86,87]: patch_legacy(i,'OSH_RULES','employee_basis','Verify operative OSH factory definition, power use, prior state thresholds/savings, activity and current state rules; do not use one legacy 10/20-worker test nationwide.','State transition affects thresholds and process.')

for i in [75,76,77]:
    process(i,'https://foscos.fssai.gov.in/','online',inspection='conditional',notes='Online application does not eliminate risk-based inspection. Check current KoB eligibility and documents; perpetual validity does not remove annual fee/compliance duties.')
    evidence(i,'FSSAI_THRESH','turnover_basis','2026 turnover tier; check KoB overrides.')
    evidence(i,'FSSAI_KOB','exceptions','Kind-of-business overrides control licence category.')
    patch_legacy(i,'FSSAI_VALID','frequency','registration_or_modification_with_ongoing_fee_and_compliance','Perpetual validity replaces ordinary expiry renewal under the revised framework.')
    patch_legacy(i,'FSSAI_VALID','deadline_text','Register/license before relevant food business activity. For certificates issued on/after 1 April 2026, apply perpetual-validity and ongoing-fee rules; check migration of existing certificates.','Do not generate obsolete blanket 1-5 year renewal tasks.')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V1')['effective_from']='2026-04-01'
patch_legacy(76,'FSSAI_THRESH','turnover_basis','Ordinary turnover tier: above INR 15000000 and up to INR 500000000 inclusive; special KoB criteria override.','Correct exact boundaries.')
patch_legacy(77,'FSSAI_THRESH','turnover_basis','Ordinary turnover tier: above INR 500000000; special KoB criteria can require Central licence at lower turnover.','Turnover is not the only criterion.')
for i in [78,79]:
    process(i,'https://www.dgft.gov.in/','online','not_required','not_required',notes='FTP states IEC application and update are completely online; query resolution may still be necessary.')
    evidence(i,'DGFT_FTP','filing_mode','IEC application/update completely online.')
patch_legacy(78,'DGFT_FTP','applicability_text','Import/export of goods generally requires IEC unless exempt. For service/technology exports, FTP benefit claims and specified controls determine IEC necessity; not every service export requires IEC.','Qualified service-export requirement.')
patch_legacy(79,'DGFT_FTP','deadline_text','Confirm/update electronically during April-June each year, even with no changes; ordinary last date 30 June, subject to notified extensions.','Annual confirmation applies without changed details.')
patch_legacy(83,'UDYAM','turnover_basis','From 1 April 2025, paired investment/turnover ceilings: Micro INR 2.5/10 crore; Small INR 25/100 crore; Medium INR 125/500 crore. Use statutory definitions and both tests.','MSME is not determined by turnover alone.')
process(83,'https://udyamregistration.gov.in/','online','not_required','not_required','not_applicable','Official process is free, paperless and based on self-declaration; no document upload and no renewal. Keep Aadhaar/PAN/GST-linked particulars available.')
next(d for d in TABLES['document_requirements'] if d['rule_id']=='C083-V1').update(document_name='Aadhaar and PAN/GST-linked particulars as applicable; no document upload required by official portal',requirement_status='supported',source_id='UDYAM')
for i in [94,95,97,98]:
    process(i,'https://ipindia.gov.in/pages/e-services','online',notes='Electronic service route exists; opposition/hearing and document-execution requirements are separate.')
    evidence(i,'IP','application_url','IP India electronic service directory.')
patch_legacy(95,'TM_RULES','deadline_text','TM-R may be filed within the year before expiry. Verify registration expiry and late renewal/restoration provisions.','Renewal window comes from Rule 57 and related rules.')
patch_legacy(103,'GST_9','deadline_text','Use the actual notice, applicable legal provision, tax period and service date. This source does not verify a uniform SCN reply period; no automatic date assigned.','Annual-return guidance cannot establish a notice deadline.')
# Remove the inappropriate evidence link introduced for the manual safety qualification above.
TABLES['evidence_assertions']=[e for e in TABLES['evidence_assertions'] if e['assertion_id']!='C103-V1-FIX-deadline_text']
next(c for c in TABLES['correction_log'] if c['correction_id']=='FIX-103-deadline_text').update(source_id='',status='manual_qualification_not_source_verified')
patch_legacy(75,'FSSAI_THRESH','turnover_basis','Ordinary turnover tier: up to INR 15000000 inclusive from 1 April 2026; special KoB criteria override.','Replaces the obsolete INR 12 lakh registration ceiling.')
for i in [103,104,105,106,107,108]:
    next(r for r in TABLES['rule_versions'] if r['rule_id']==f'C{i:03d}-V1')['deadline_json']=json.dumps({'type':'notice_supplied','requires':['notice_received_at','notice_deadline','legal_provision']})

def condition(i,expr,note):
    rid=f'C{i:03d}-V1'
    def fields(x): return ([x['field']] if 'field' in x else []) + [v for k in ['all','any'] for y in x.get(k,[]) for v in fields(y)]
    add('applicability_conditions',condition_id=rid+'-COND',rule_id=rid,expression_json=json.dumps(expr),expression_status='candidate_condition_requires_full_rule_review',required_facts_json=json.dumps(sorted(set(fields(expr)))),notes=note)

def term(f,op,v): return {'field':f,'op':op,'value':v}
condition(11,{'all':[term('gst_max_aato_since_2017_inr','gt',50000000),term('gst_registered','eq',True),term('e_invoice_exempt','eq',False)]},'Screening condition only; covered document/supply must also be established.')
condition(52,{'all':[term('estimated_net_tax_inr','gte',10000),term('is_exempt_senior_citizen','eq',False)]},'Presumptive-payment timing differs; use period-appropriate law.')
for i,expr in [(75,{'all':[term('food_turnover_inr','lte',15000000),term('special_fssai_category','eq',False)]}),(76,{'all':[term('food_turnover_inr','gt',15000000),term('food_turnover_inr','lte',500000000),term('special_fssai_category','eq',False)]}),(77,{'all':[term('food_turnover_inr','gt',500000000),term('special_fssai_category','eq',False)]})]:
    condition(i,expr,'Ordinary tier screening only. Food activity and applicable KoB must be confirmed; special-category paths remain manual.')

# Period-specific form versions share the original compliance identity.
def tax_version(i,form,sid,deadline='Check period/category-specific due date',law='Income-tax Act 2025 / Income-tax Rules 2026'):
    import copy
    old=f'C{i:03d}-V1'; new=f'C{i:03d}-V2'
    r=copy.deepcopy(next(r for r in TABLES['rule_versions'] if r['rule_id']==old))
    r.update(rule_id=new,governing_law=law,tax_period='Tax Year 2026-27 onwards; transaction transition rules where relevant',effective_from='2026-04-01',deadline_text=deadline,exceptions_text='New form: '+form+'. Check applicable new-law rule, transition, eligibility and extensions.',verification_status='researched_partial')
    TABLES['rule_versions'].append(r)
    for t,pk in [('rule_triggers','rule_trigger_id'),('rule_entities','rule_entity_id'),('document_requirements','document_id'),('process_profiles','process_id')]:
        for v in list(TABLES[t]):
            if v['rule_id']==old:
                v=copy.deepcopy(v); v[pk]=v[pk].replace(old,new); v['rule_id']=new
                if t=='document_requirements': v['document_name']='Current '+form+' data and supporting records; confirm form-specific checklist'
                TABLES[t].append(v)
    add('evidence_assertions',assertion_id=new+'-MAP',rule_id=new,source_id=sid,field_name='form_mapping',finding='New form '+form+' for applicable new-law periods.',verification_status='supported_within_source_scope')
for i,form in [(54,'138'),(55,'140'),(56,'144'),(57,'143'),(61,'145 / 146')]: tax_version(i,form,'IT_FORMS')
tax_version(50,'26','IT_AUDIT','Ordinary tax-audit report for Tax Year 2026-27: 30 September 2027, subject to category/extension.')
tax_version(60,'141 (property schedule)','FORM141')

add('deadline_overrides',override_id='EPF-DEC2025-ECR',rule_id='C064-V1',period_key='wage_month:2025-12',original_due_date='2026-01-15',override_due_date='2026-01-22',source_id='EPF_EXTENSION',notes='ECR filing extension; do not assume a blanket extension of contribution-payment interest/default computation.')
