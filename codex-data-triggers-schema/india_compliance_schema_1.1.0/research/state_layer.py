# Coverage rows are a research inventory, not fabricated state obligations.
source('MH_PT','https://www.mahagst.gov.in/user-registration/pt','Maharashtra PT registration','PTRC and PTEC online registration')
source('KA_PT','https://ptax.karnataka.gov.in/','Karnataka profession tax portal','Online PT services; annual payment extension to 5 May 2026')
source('KA_PT_RATE','https://ptax.karnataka.gov.in/ptemployer/documents/ptnotificationfeb%20-%2015.04.2025.pdf','Karnataka 2025 PT schedule amendment','February rate amendment from 1 April 2025','notification')
source('WB_PT','https://professiontax.wb.gov.in/new-enrol/enrol-landing','West Bengal PT enrolment','Online enrolment within ninety days for covered schedule entries')
source('WB_PT_PAPER','https://comtax.wb.gov.in/','West Bengal Commercial Taxes notices','No paper PT return; August 2026 schedule amendments require review')
source('ML_SERVICES','https://invest.meghalaya.gov.in/InformationWizard.aspx','Meghalaya approval inventory','Listed approval categories; some department labels appear mismatched')
source('MCD_GTL','https://mcdonline.nic.in/gtlmcd/web/citizen/gtl/downloadGTLdocuments/gtlsop','MCD general trade licence SOP','Online application, payment and applicant-generated licence')
source('CHENNAI_TRADE','https://chennaicorporation.gov.in/gcc/online-services/trade-license/','Chennai trade licence services','Online new and renewal routes')
source('CHENNAI_SOP','https://portal.chennaicorporation.gov.in/gcc/pdf/REVENUE_HELP.pdf','Chennai revenue service SOP','Category-specific trade-licence routes and service timelines')
source('CHENNAI_DOCS','https://www.chennaicorporation.gov.in/images/trade%20licence.pdf','Chennai trade document circular 23 October 2017','Simplified initial online upload; additional records during processing','notification')

PCBS={
'AP':'https://pcb.ap.gov.in/','AR':'https://apspcb.net/','AS':'http://www.pcbassam.org','BR':'https://bspcb.bihar.gov.in/',
'CG':'http://www.enviscecb.org','GA':'https://goaspcb.gov.in/','GJ':'http://gpcb.gov.in','HR':'http://hspcb.gov.in',
'HP':'http://hppcb.nic.in','JK':'https://jkpcb.jk.gov.in/','JH':'https://jspcb.org.in/','KA':'https://kspcb.karnataka.gov.in',
'KL':'https://kspcb.kerala.gov.in/','MP':'https://www.mppcb.mp.gov.in/','MH':'http://mpcb.gov.in','MN':'https://manipcb.nic.in/',
'ML':'http://megspcb.gov.in','MZ':'https://mpcb.mizoram.gov.in/','NL':'https://npcb.nagaland.gov.in/?cat=5','OD':'https://ospcboard.odisha.gov.in/',
'PB':'https://ppcb.punjab.gov.in/en/','RJ':'https://environment.rajasthan.gov.in/content/environment/en/rajasthan-state-pollution-control-board.html#',
'SK':'https://spcb.sikkim.gov.in/index.html','TN':'http://www.tnpcb.gov.in','TG':'https://tgpcb.cgg.gov.in/',
'TR':'http://tspcb.tripura.gov.in','UP':'http://www.uppcb.com','UK':'http://ueppcb.uk.gov.in','WB':'http://www.wbpcb.gov.in',
'DL':'http://www.dpcc.delhigovt.nic.in/indexdup.php','PY':'https://dste.py.gov.in/ppcc/Index.html','CH':'https://cpcc.chd.gov.in/',
'DN':'https://ddd.gov.in/pollution-control-committee/','AN':'http://andssw1.and.nic.in/swc/depts/pcc/','LD':'https://lpcc.utl.gov.in/',
'LA':'https://www.ldocmms.nic.in/'}
SINGLE={'AR':('https://eodb.arunachal.gov.in/active-services','AR_SW'),'CG':('https://www.invest.cg.gov.in/one-click','CG_SW'),'MH':('https://maitri.maharashtra.gov.in/','MH_SW'),'ML':('https://invest.meghalaya.gov.in/SingleWindowPortalDashboard.aspx','ML_SW'),'HP':('https://emerginghimachal.hp.gov.in/','HP_SW'),'NL':('https://eodb.nagaland.gov.in/','NL_SW'),'JK':('https://singlewindow.jk.gov.in/serviceplus/','JK_SW'),'RJ':('https://swcs.rajasthan.gov.in/ApprovalsList.aspx','RJ_SW')}
PT={'PB':('https://psdt.punjab.gov.in/','PB_PT'),'MN':('https://professionaltax.mn.gov.in/Default.aspx','MN_PT'),'NL':('https://taxsoft-ngl.nic.in/Ptaxnagaland/TaxPayer/Schedule','NL_PT'),'ML':('https://megtaxation.nic.in/','ML_PT'),'MZ':('https://zotax.nic.in/files/tax_schedules/Final%20Profession%20Tax%20Slab%202024.pdf','MZ_PT'),'TR':('https://www.indiacode.nic.in/handle/123456789/18126?sam_handle=123456789%2F2509','TR_PT'),'SK':('https://sfc.sikkim.gov.in/','SK_PT'),'MH':('https://www.mahagst.gov.in/user-registration/pt','MH_PT'),'KA':('https://ptax.karnataka.gov.in/','KA_PT'),'WB':('https://professiontax.wb.gov.in/new-enrol/enrol-landing','WB_PT')}
TOPICS=['professional_tax','shops_establishments','labour_welfare_fund','factory_licensing','pollution_cte','pollution_cto','hazardous_waste','fire_safety','municipal_trade','building_occupancy','state_drug_licensing','excise','legal_metrology','rera','psara','state_food_safety','groundwater','boilers']
state_by_name={n:code for code,n,_ in STATES}
legacy_state_ids={}
for i,row in enumerate(legacy_states,1):
    original=row['State_UT']; name=re.sub(r'\s*\([^)]*\)','',original).strip().replace('&','and')
    code=state_by_name.get(name)
    assert code,(original,name)
    lid=f'S{i:03d}'; legacy_state_ids[code]=lid
    add('legacy_rows',legacy_row_id=lid,input_file='india_state_compliance_matrix.csv',input_row_number=i+1,raw_json=json.dumps(row,ensure_ascii=False))

for code,name,_ in STATES:
    add('authorities',authority_id='AUTH-'+code+'-PCB',name=name+' pollution board / committee',jurisdiction_id='IN-'+code,website_url=PCBS[code],source_id='LA_PCB' if code=='LA' else 'CPCB_DIR',verification_status='directory_confirmed_not_endpoint_tested')
    for topic in TOPICS:
        url,sid=SINGLE.get(code,('https://www.nsws.gov.in/state-list','NSWS'))
        cov=dict(coverage_id=code+'-'+topic,jurisdiction_id='IN-'+code,topic=topic,applicability_status='requires_activity_and_local_law_review',authority_url=url,source_id=sid,coverage_status='discovery_only',next_verification='Identify competent authority, operative statute/rules, exact triggers, due dates, documents, live application and physical steps. Directory inclusion does not prove this service is available.',legacy_row_id=legacy_state_ids.get(code,''))
        if topic in ['pollution_cte','pollution_cto','hazardous_waste']:
            cov.update(authority_url=PCBS[code],source_id='LA_PCB' if code=='LA' else 'CPCB_DIR',coverage_status='authority_directory_confirmed',next_verification='Check current industrial classification, consent exemptions, state form/fee/validity, renewal deadline, inspections and operating application endpoint.')
        if topic in ['municipal_trade','building_occupancy']:
            cov['next_verification']='Resolve municipality/panchayat/development authority and premises use. One city example cannot establish state-wide obligations or online completion.'
        if topic=='professional_tax':
            if code in PT:
                url,sid=PT[code]; cov.update(authority_url=url,source_id=sid,applicability_status='levy_evidenced_schedule_requires_review',coverage_status='levy_or_service_evidenced',next_verification='Verify current schedule, employer versus own-account liability, exemptions, registration time, payment and return dates. This does not mean every entity owes tax.')
                if code in ['PB','MN','NL','ML','MH','KA','WB']: cov['application_url']=url
            elif code=='CG':
                cov.update(source_id='CG_PT',applicability_status='historical_discontinuance_current_status_unresolved',coverage_status='conflict_flagged',next_verification='2011 state budget says profession tax discontinued, contradicting imported Yes. Verify current statute/reintroduction before deciding current non-levy.')
            elif code in legacy_state_ids:
                cov.update(applicability_status='legacy_claim_unverified',coverage_status='imported_unverified',next_verification='Original Yes/No retained in legacy_rows only; verify present levy/exemptions from current official law. A missing portal is not evidence of non-levy.')
        add('state_coverage',**cov)

def state_rule(code,suffix,name,dept,topic,law,applies,deadline,sid,docs='',**kw):
    jur=kw.pop('jur','IN-'+code)
    rid=extra('S-'+code+'-'+suffix,name,dept,law,applies,deadline,kw.pop('triggers',['industry','location']),sid,docs,jur=jur,scope='local' if jur.count('-')>1 else 'state',**kw)
    auth='AUTH-'+code+'-'+dept
    if auth not in {a['authority_id'] for a in TABLES['authorities']}:
        s=next(s for s in TABLES['sources'] if s['source_id']==sid)
        add('authorities',authority_id=auth,name=next(n for c,n,_ in STATES if c==code)+' - '+dept+' authority (see source)',jurisdiction_id='IN-'+code,website_url=s['url'],source_id=sid,verification_status='source_scoped')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['authority_id']=auth
    cov=next(c for c in TABLES['state_coverage'] if c['coverage_id']==code+'-'+topic)
    cov.update(coverage_status='partial_rule_research',source_id=sid)
    add('coverage_rules',coverage_rule_id=cov['coverage_id']+'-'+rid,coverage_id=cov['coverage_id'],rule_id=rid)
    return rid

state_rule('PB','PSDT-REG','Punjab development tax registration','PT','professional_tax','Punjab State Development Tax Act and Rules','Employers/persons within the PSDT schedule and exemptions; not a blanket charge on every resident.','Resolve statutory liability date and applicable registration deadline.','PB_PT_FORM','PAN upload; entity and applicant particulars; address/contact and employer details',mode='online',website='https://psdt.punjab.gov.in/register',triggers=['location','employee','industry'],finding='Official live form supports employer/individual registration; contradicts imported Punjab no-PT assertion.')
state_rule('PB','PSDT-ELECT','Punjab development tax lump-sum election','PT','professional_tax','Punjab State Development Tax First Amendment Rules 2025','Eligible person choosing the optional lump-sum route.','Form 17/18 election by 31 March preceding the financial year; payment by 30 April for elected route.','PB_PT_RULES','Election form; registration details; payment particulars',kind='optional_scheme',triggers=['date','transaction'],frequency='annual',website='https://psdt.punjab.gov.in/',notes='Optional payment method; do not treat these dates as the universal employer return schedule.')
for code in ['MH','KA','MN','NL','ML']:
    url,sid=PT[code]
    state_rule(code,'PT-REG',next(n for c,n,_ in STATES if c==code)+' profession tax registration / enrolment','PT','professional_tax','Applicable state profession-tax Act, schedule and rules','Employers and/or persons within the current state schedule; employee deductions and entity enrolment are separate tests.','Current schedule and registration/payment deadlines require form-specific verification.',sid,'PAN and applicant/entity particulars; employment/business and address details as requested by current form',mode='online',website=url,triggers=['location','employee','industry'],notes='Online service verified; rates, exemptions, filing frequency and absence of visits not fully verified.')
state_rule('WB','PT-ENROL','West Bengal profession tax enrolment','PT','professional_tax','West Bengal profession-tax Act and Rules','Persons covered by the relevant schedule entries 2 to 4; check August 2026 schedule amendments.','Within 90 days from liability to pay tax.','WB_PT','PAN; person/entity and business details; liability commencement information',mode='online',website=PT['WB'][0],finding='Official enrolment page sets ninety-day application period for specified entries.')
state_rule('WB','PT-RETURN','West Bengal employer profession tax return','PT','professional_tax','West Bengal profession-tax Act and Rules','Registered employers with return liability.','Determine current return period/deadline separately from payment.','WB_PT_PAPER','Employee salary/tax deductions; payment details; registration particulars',mode='online',physical='not_required',website='https://comtax.wb.gov.in/',frequency='periodic',triggers=['date','employee'],finding='Department explicitly says no paper copy of profession-tax return need be submitted at CTD offices.')
state_rule('TN','SHOPS-REG','Tamil Nadu shops and establishments registration','SHOPS','shops_establishments','Tamil Nadu Shops and Establishments Act and current rules','Covered establishments with ten or more workers as shown on official registration form; evaluate exemptions.','Determine commencement-based registration deadline from current rules.','TN_SE','PAN; establishment address evidence (GST/EB bill as form requires); trade licence; Tamil name-board photo; employer/worker details',employees='At least 10 workers on published form; confirm definitions/exemptions',mode='online',website='https://labour.tn.gov.in/services/shop-establishments/registration',triggers=['employee','location'],finding='Published online form identifies ten-worker condition and upload fields; annual renewal not established.')
state_rule('AN','SHOPS','Andaman and Nicobar shops registration / renewal','SHOPS','shops_establishments','Applicable Andaman and Nicobar shops regulation/rules','Covered shops and establishments in the UT.','Current registration and certificate renewal timeline requires verification.','AN_LABOUR','Employer/entity and establishment particulars; current service checklist required',mode='online',website='https://labour.and.nic.in/labour/',triggers=['location','industry','licence'],finding='Labour portal lists shops registration and renewal; no unsupported lifetime-validity claim.')
state_rule('GA','LM-REG','Goa manufacturer / packer / importer registration','LEGAL_METROLOGY','legal_metrology','Legal Metrology (Packaged Commodities) Rules; Goa procedure','Covered manufacturers/packers/importers applying to Goa competent authority.','Apply using current service procedure; Rule 27 framework in N028.','GOA_LM','Entity and premises particulars; packing/product and authorisation records',mode='online',website='https://clm.goa.gov.in/service/registration-of-manufacturer-packer-importer/')
for suffix,topic,stage in [('CTE','pollution_cte','establish'),('CTO','pollution_cto','operate')]:
    rid=state_rule('LA',suffix,'Ladakh consent to '+stage,'POLLUTION',topic,'Water/Air consent framework and Ladakh pollution-control procedure','Covered premises/activities after checking classification and exemptions.','Prior consent for covered '+stage+' activity; certificate-specific renewal.','LA_PCB','Project/process; site and land evidence; emissions/effluent and control systems; supporting permissions',mode='online',physical='not_required',inspection='conditional',website='https://www.ldocmms.nic.in/',triggers=['industry','location','licence'],notes='Official launch describes paperless consent applications; not an exemption from premises inspections.')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['authority_id']='AUTH-LA-PCB'
    add('evidence_assertions',assertion_id=rid+'-PAPER',rule_id=rid,source_id='LA_PCB_RELEASE',field_name='physical_submission',finding='Official OCMMS launch describes paperless application process.',verification_status='supported_within_source_scope')
    next(c for c in TABLES['state_coverage'] if c['coverage_id']=='LA-'+topic)['application_url']='https://www.ldocmms.nic.in/'
state_rule('ML','EXCISE','Meghalaya excise licence for controlled liquor activity','EXCISE','excise','Meghalaya excise legislation and current policy','Wholesale, retail, bottling or distillery activity within licensed classes.','Before licensed activity; verify licence class and current policy/validity.','ML_SERVICES','Applicant/entity; premises and activity particulars; current excise checklist required',website='https://invest.meghalaya.gov.in/InformationWizard.aspx',triggers=['industry','location','licence'],finding='State approval inventory lists distinct excise licence classes; full procedure is unresolved.')
state_rule('KL','RERA','Kerala RERA project registration','RERA','rera','RERA Act; Kerala authority clarification','Project registration where land exceeds 500 sq m OR apartments exceed eight inclusive of phases, subject to statutory exclusions and current interpretation.','Before covered advertising/marketing/booking/sale; check project status and exemptions.','RERA_KL','Project/title/approval particulars; promoter and financial information; current authority checklist',triggers=['industry','location','transaction'],finding='Kerala clarification treats project area and apartment-count tests as alternatives; do not extrapolate its interpretation to all jurisdictions.')

for jid,name,parent,sid in [('IN-DL-MCD','Municipal Corporation of Delhi area','IN-DL','MCD_GTL'),('IN-TN-CHENNAI','Greater Chennai Corporation area','IN-TN','CHENNAI_TRADE')]:
    add('jurisdictions',jurisdiction_id=jid,name=name,level='local_body',parent_id=parent,source_id=sid)
state_rule('DL','MCD-GTL','MCD general trade / storage licence','MUNICIPAL','municipal_trade','Delhi municipal legislation and MCD GTL procedure','Scheduled general trades/storage in MCD jurisdiction; NDMC and cantonment areas need separate rules.','Before covered trade; renewal/amendment according to current certificate and SOP.','MCD_GTL','Trade category; premises/constitution/storage information; applicable uploaded supporting documents',jur='IN-DL-MCD',mode='online',website='https://mcdonline.nic.in/gtlmcd',triggers=['industry','location','licence'],notes='SOP provides online payment and applicant-generated licence. Absence of all inspection or original-document requirements is not verified.')
state_rule('TN','GCC-TRADE','Greater Chennai trade licence','MUNICIPAL','municipal_trade','Tamil Nadu urban local-body framework and GCC trade procedure','Covered trades in GCC jurisdiction; small-premises service class has its own conditions.','Use actual licence validity and current trade category; service turnaround is not filing due date.','CHENNAI_SOP','Applicant identity; premises rental agreement/property-tax receipt; photographs; further category-specific documents may be requested',jur='IN-TN-CHENNAI',mode='online_or_assisted',website='https://chennaicorporation.gov.in/gcc/online-services/trade-license/',inspection='conditional',triggers=['industry','location','licence'],notes='Published SOP allows online and assisted/office routes. Historic checklists should be checked against current service class.')
add('evidence_assertions',assertion_id='S-TN-GCC-TRADE-V1-DOCS',rule_id='S-TN-GCC-TRADE-V1',source_id='CHENNAI_DOCS',field_name='documents',finding='2017 circular simplifies initial upload and allows further records during processing; currency must be checked.',verification_status='historical_source_requires_current_check')

# Explicit corrections preserve the original row rather than silently replacing evidence.
for code,field,replacement,sid in [
 ('PB','Professional_Tax_Applicable','Punjab State Development Tax exists; test schedule/exemptions. Original No is not accepted.','PB_PT'),
 ('CG','Professional_Tax_Applicable','2011 official budget discontinued PT. Imported Yes held unresolved pending current-law check.','CG_PT'),
 ('MH','SE_Validity','Original lifetime claim rejected: 2017 Act provided validity up to ten years. Resolve 2025 amendment and subsequent operative law.','MH_SE'),
 ('TN','SE_Validity','Annual renewal not substantiated by inspected registration form; leave validity unresolved.','TN_SE'),
 ('KA','PT_Return_Frequency','Do not conflate monthly employer deductions with annual enrolment payment; 2026 annual payment extension is period-specific.','KA_PT')]:
    lid=legacy_state_ids[code]; original=json.loads(next(r['raw_json'] for r in TABLES['legacy_rows'] if r['legacy_row_id']==lid))[field]
    add('correction_log',correction_id='STATE-'+code+'-'+field,legacy_row_id=lid,field_name=field,original_value=original,replacement_or_action=replacement,source_id=sid,status='corrected_or_qualified')

# State routing is always limited by evidence; preserve all 36 x 18 slots, even unresolved ones.
assert len(TABLES['state_coverage'])==36*len(TOPICS)
