"""Asset, investor and excise extension. Research staging, 15 September 2026.
Directory coverage is not a legal rule. Unknown physical steps stay unknown.
"""
table('asset_classes','asset_class_id:TEXT|name:TEXT|scope_note:TEXT')
table('rule_asset_scopes','rule_asset_scope_id:TEXT|rule_id:TEXT:rule_versions.rule_id|asset_class_id:TEXT:asset_classes.asset_class_id|actor_role:TEXT|mapping_status:TEXT')
table('state_property_profiles','property_profile_id:TEXT|jurisdiction_id:TEXT:jurisdictions.jurisdiction_id|record_terms:TEXT|terms_status:TEXT|ror_url:TEXT|registration_url:TEXT|mutation_url:TEXT|land_revenue_url:TEXT|source_id:TEXT:sources.source_id|service_source_id:TEXT:sources.source_id|route_status:TEXT|physical_steps_status:TEXT|restriction_review:TEXT|title_note:TEXT|checked_on:TEXT')
TABLE_ORDER.extend(['asset_classes','rule_asset_scopes','state_property_profiles'])
ASSET_SOURCES=[
 ('AX_DOLR','https://dolr.gov.in/en/citizen-centric-services/','DoLR citizen services and state RoR directory','State portal routing and registration overview','opened_page'),
 ('AX_SCI','https://api.sci.gov.in/supremecourt/2024/41857/41857_2024_14_1502_67116_Judgement_19-Dec-2025.pdf','Supreme Court judgment, 19 December 2025','Mutation entries are fiscal records and do not create title','search_excerpt'),
 ('AX_REG','https://www.indiacode.nic.in/bitstream/123456789/19013/1/the_registration_act%2C_1908.pdf','Registration Act 1908','Presentation period and registration framework; local amendments require review','search_excerpt'),
 ('AX_WB_LAND','https://banglarbhumi.gov.in/BanglarBhumi/Forms','Banglarbhumi forms','Mutation and land revenue (Khajna) services','search_excerpt'),
 ('AX_WB_REV','https://banglarbhumi.gov.in/BanglarBhumi/RevenueApplication.action','Banglarbhumi revenue application','Khatian and plot-based revenue application','search_excerpt'),
 ('AX_WB_MUT','https://wb.gov.in/government-schemes-details-mutation-of-land-records.aspx','West Bengal mutation service','Online mutation application/tracking','search_excerpt'),
 ('AX_BR','https://biharbhumi.bihar.gov.in/BiharBhumi/FAQ_Help','Bihar Bhumi services FAQ','Jamabandi, mutation, Bhu Lagan, Parimarjan, possession certificate, map and conversion services','search_excerpt'),
 ('AX_MH','https://mahabhumi.gov.in/Mahabhumilink/LogIn/LogIn','Mahabhumi services','Digitally signed land extracts and e-Hakk mutation applications','search_excerpt'),
 ('AX_TN','https://tn.nic.in/news/additional-land-records-services-launch-by-honourable-minister-for-revenue-and-disaster-management-tamil-nadu/','NIC Tamil Nadu land record services','Integrated land record, FMB and history of patta transfer','search_excerpt'),
 ('AX_KA','https://kalaburagi.nic.in/en/service/land-records/','Karnataka district Bhoomi service','RTC changes through mutation; landrecords portal route','search_excerpt'),
 ('AX_KL','https://www.revenue.kerala.gov.in/revenueportalbeta/index.php','Kerala revenue e-services','Taxes and service fees can be remitted online; village-specific rollout unresolved','search_excerpt'),
 ('AX_PY','https://revenue.py.gov.in/state_govt_list.html','Puducherry official portal directory','Nilamagal and land registration routes','search_excerpt'),
 ('AX_TG','https://www.bhubharati.telangana.gov.in/Bhubharati_faq','Bhu Bharati FAQs','Mutation application route','search_excerpt'),
 ('AX_TG_RULE','https://bhubharati.telangana.gov.in/assets/images/userManuals/G_O_Ms_no_39_Dated_14_04_2025.pdf','Telangana GO Ms 39, 14 April 2025','Registration/mutation and prohibited-property check','search_excerpt'),
 ('AX_HP','https://himseva.hp.gov.in/pages/staticSite/serviceList.xhtml','Himachal HimSeva services','Section 118 sale and change-of-use permission services','search_excerpt'),
 ('AX_SEBI_INV','https://investor.sebi.gov.in/securities-trading.html','SEBI starting securities investment','Demat/trading accounts and KYC','opened_page'),
 ('AX_SEBI_REG','https://sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=2&smid=0&ssid=3','SEBI updated regulations directory','SAST, PIT and intermediary regulation families; detailed current provisions need review','search_excerpt'),
 ('AX_PIT','https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1752572636085.pdf','SEBI PIT Regulations consolidated March 2025','UPSI, designated-person codes; check subsequent amendments','search_excerpt'),
 ('AX_IA','https://investor.sebi.gov.in/investment_advisor.html','SEBI investment adviser guidance','Registration for investment advice business','search_excerpt'),
 ('AX_IARA','https://iaraportal.sebi.gov.in/','SEBI IA/RA portal','Investment adviser and research analyst registration route','search_excerpt'),
 ('AX_LRS','https://www.rbi.org.in/scripts/notificationuser.aspx?id=10192','RBI LRS Master Direction','Resident individual annual aggregate and permitted/prohibited remittances','search_excerpt'),
 ('AX_NRI_LAND','https://systemhealth.rbi.org.in/Scripts/FS_FAQs.aspx_Id%3D117%26fn%3D5.html','RBI purchase of immovable property FAQ','NRI/OCI purchase classes and exclusions; acquisition mode matters','search_excerpt'),
 ('AX_STOCKTAX','https://www.incometaxindia.gov.in/en/sale-of-shares','Income Tax Department sale of shares','Capital gains classification and transfer-date distinctions','search_excerpt'),
 ('AX_FA','https://www.incometax.gov.in/iec/foportal/nudge/nudge-schedule-fa','Income Tax Schedule FA guidance','Foreign asset/income disclosure','opened_page'),
 ('AX_DL_EX','https://excise.delhi.gov.in/excise/licences','Delhi excise licence classes','Hotel/club and other licence categories','search_excerpt'),
 ('AX_WB_EX','https://excise.wb.gov.in/CommonUser/egovernance.aspx','West Bengal eAbgari services','Licence applications, renewals, label registrations and movement permits','opened_page'),
 ('AX_WB_TEMP','https://excise.wb.gov.in/Portal_New_Default.aspx','West Bengal excise portal','Temporary bar service','search_excerpt'),
 ('AX_MH_EX','https://www.stateexcise.maharashtra.gov.in/Form_FLII.aspx','Maharashtra FL-II service','Retail liquor licence class; availability subject to policy','search_excerpt'),
 ('AX_CG_EX','https://excise.cg.nic.in/ePayment/Citizen_Charter.aspx','Chhattisgarh excise citizen charter','Restaurant bar/hotel and import/export service classes','search_excerpt'),
 ('AX_BR_EX','https://state.bihar.gov.in/excise/CitizenHome.html','Bihar prohibition and excise department','Prohibition framework; do not assume ordinary liquor licence availability','search_excerpt'),
 ('AX_IF_REST','https://www.indiafilings.com/learn/licenses-and-registrations-required-for-restaurant','IndiaFilings restaurant licensing discovery','Discovery only: local eating-house and liquor topics require current official verification','search_excerpt')]
for sid,url,title,supports,method in ASSET_SOURCES:
    source(sid,url,title,supports,kind='secondary_commercial' if sid=='AX_IF_REST' else 'official_research',method=method)
    next(s for s in TABLES['sources'] if s['source_id']==sid)['accessed_on']=SCAN_DATE
for did,name,sid,url in [
 ('SECURITIES','Securities investors and regulated intermediaries','AX_SEBI_REG','https://www.sebi.gov.in/'),
 ('LAND_RECORDS','Land records, revenue and tenure','AX_DOLR','https://dolr.gov.in/en/citizen-centric-services/'),
 ('PROPERTY_REGISTRATION','Property transfer and registration','AX_REG','https://dolr.gov.in/en/citizen-centric-services/')]:
    DEPTS.append((did,name,'Investments & Property'))
    add('departments',department_id=did,name=name,navigation_category='Investments & Property',taxonomy_note='Application grouping; state/local implementing authority varies')
    add('authorities',authority_id='AUTH-'+did,name=name+' competent authority',jurisdiction_id='IN',website_url=url,source_id=sid,verification_status='framework_or_directory_only')
# Add personal investors after legacy business filters were built: no retroactive claim
# that every company or payroll obligation applies to every individual.
for eid,name in [('individual','Individual in personal capacity'),('huf','Hindu undivided family')]:
    ENTITIES.append((eid,name,'Personal / family investor'))
    add('entity_types',entity_type_id=eid,name=name,ui_group='Personal / family investor')
for aid,name,note in [('listed_security','Listed securities','Equity, debt and units need instrument-specific tax treatment'),('foreign_security','Foreign securities','Residency, OPI/ODI and remittance route matter'),('land','Land parcel','Agricultural/urban/tribal/leasehold classifications are separate facts'),('building','Building or unit','Underlying land and local approvals also require review'),('liquor_premises','Liquor-related premises/activity','Licence class and permitted products are state-specific')]:
    add('asset_classes',asset_class_id=aid,name=name,scope_note=note)
ASSET_ADDITIONS=[]
def ax(name,dept,law,applies,deadline,triggers,sid,docs='',asset=None,role='owner_or_operator',**kw):
    cid='AX%03d'%(len(ASSET_ADDITIONS)+1)
    finding=kw.pop('finding',next(s['supports'] for s in TABLES['sources'] if s['source_id']==sid))
    url=kw.pop('website',next(s['url'] for s in TABLES['sources'] if s['source_id']==sid))
    rid=new_rule(cid,name,dept,law,applies,deadline,triggers,documents=docs,sources=[(sid,'framework_or_procedure',finding)],website=url,**kw)
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['checked_on']=SCAN_DATE
    ASSET_ADDITIONS.append(rid)
    if asset: add('rule_asset_scopes',rule_asset_scope_id=rid+'-'+asset,rule_id=rid,asset_class_id=asset,actor_role=role,mapping_status='candidate_context_not_final_eligibility')
    return rid

# Securities: personal investing is distinct from supplying regulated services.
ax('Securities account opening and KYC updates','SECURITIES','SEBI/depository/intermediary KYC framework','Applicant opening or updating a securities account; intermediary and residency category determine documents.','At onboarding and when notified of required updates.',['transaction','notice'],'AX_SEBI_INV','PAN/identity/address and bank evidence; current intermediary KYC checklist',asset='listed_security',role='investor',mode='online_or_assisted',notes='Video/in-person verification and original-document checks depend on approved method; do not assume all channels are visit-free.')
ax('Report securities sale income and calculate applicable tax','INCOME_TAX','Income-tax law applicable to the tax period and transfer date','Holder disposing of securities; determine capital asset versus business stock, instrument, holding period, STT conditions and residency.','Applicable return and advance-tax deadlines; select correct tax-year regime.',['transaction','date','law_change'],'AX_STOCKTAX','Contract notes; acquisition cost; corporate actions; STT/charges; broker ledger and statements',asset='listed_security',role='investor',mode='online',notes='No single equity rate applies to all stocks, funds, derivatives or foreign securities. Map pre/post 1 April 2026 law and period-specific forms before automation; business trading turnover is not portfolio value.')
ax('Foreign asset and income disclosure review','INCOME_TAX','Applicable income-tax foreign asset/income disclosure requirements','Assess taxpayer residence category and relevant return schedules for foreign shares/accounts/income; calendar-year asset reporting may differ from financial-year income.','Relevant income-tax return deadline; check exact schedule reference period.',['date','transaction','location'],'AX_FA','Foreign account statements; holdings and peak/closing balances; income and foreign tax evidence',asset='foreign_security',role='investor',mode='online',notes='Do not assign Schedule FA to every NRI or RNOR merely because assets are overseas. Foreign tax credit and treaty relief need their own conditions.')
ax('Resident individual overseas investment remittance screening','FEMA','FEMA; RBI Liberalised Remittance Scheme and applicable overseas investment rules','Resident individuals remitting for permitted overseas investments; aggregate all LRS purposes in the financial year.','Before remittance; review aggregate USD 250000 annual ceiling and permitted purpose.',['transaction','date','location'],'AX_LRS','PAN; AD-bank purpose declaration; prior FY remittances; investment details',asset='foreign_security',role='resident_individual',entities=['individual'],notes='LRS is not a company/HUF remittance allowance. Overseas margin remittances are restricted; OPI/ODI classification and applicable tax collection require separate assessment.')
ax('Insider trading and UPSI conduct restrictions','SECURITIES','SEBI (Prohibition of Insider Trading) Regulations 2015, as amended','Persons possessing UPSI or otherwise within insider definitions; exceptions and defences are fact-specific.','Before trading or communicating information; ongoing conduct restriction.',['transaction','law_change'],'AX_PIT','Insider status; information access timeline; lawful-purpose records where relevant',asset='listed_security',role='insider',kind='conduct_restriction',notes='Not a filing for every retail investor. Verify amendments after the inspected consolidation.')
ax('Designated-person trading window and pre-clearance','SECURITIES','SEBI PIT Regulations and applicable code of conduct','Designated persons and covered relatives under the relevant organisation code.','Before trade and within organisation-specific disclosure periods.',['transaction','notice','director_partner'],'AX_PIT','Designation; related persons; pre-clearance; trading plan/code and holdings',asset='listed_security',role='designated_person',notes='Do not apply employer pre-clearance or contra-trade restrictions universally to retail investors.')
ax('Substantial shareholding acquisition/disposal disclosure review','SECURITIES','SEBI SAST Regulations 2011, as amended','Listed-company shareholders/acquirers and persons acting in concert whose holdings/change trigger current disclosure provisions.','Assess before transaction; current regulation determines deadline and recipients.',['transaction','director_partner'],'AX_SEBI_REG','Holdings and voting rights; PAC aggregation; last disclosure; transaction dates',asset='listed_security',role='substantial_shareholder',notes='Current thresholds, exemptions and system-driven disclosure rules await provision-level review; no executable threshold is asserted.')
ax('Acquisition of control / open offer screening','SECURITIES','SEBI SAST Regulations 2011, as amended','Proposed acquisition of listed-company voting rights or control; aggregate PAC and evaluate exemptions.','Before binding acquisition/announcement; transaction-specific open-offer timetable.',['transaction','director_partner'],'AX_SEBI_REG','Acquisition agreements; control rights; PAC and shareholding; exemption analysis',asset='listed_security',role='acquirer',notes='Do not equate substantial-shareholder disclosure with an open-offer obligation.')
for name,role in [('Investment adviser registration and conditions','investment_adviser'),('Research analyst registration and conditions','research_analyst')]:
    ax(name,'SECURITIES','Applicable SEBI IA/RA regulations and current circulars','Person providing covered investment advice or research services; assess exclusions and scope of paid/public services.','Before covered activity; registration conditions control ongoing reporting and fees.',['industry','licence','law_change'],'AX_IARA','Applicant constitution/identity; qualifications; certifications; compliance arrangements; current application checklist',asset='listed_security',role=role,mode='online',notes='Owning or trading one’s own shares does not itself require IA/RA registration. Registration is not a substitute for each ongoing regulatory obligation.')

# Property framework and due diligence: one framework, separately routed by state.
TITLE_NOTE='Mutation/RoR and revenue receipts alone do not establish title; independently examine deeds, encumbrances, litigation and possession.'
ax('Property title and competing-rights due diligence','PROPERTY_REGISTRATION','Property/registration framework; Supreme Court distinction between title and mutation','Proposed purchaser, lender or transferee of land/building.','Before commitment/payment/registration; refresh before completion.',['transaction','location'],'AX_SCI','Title chain; certified deeds; encumbrances and mortgages; court/acquisition searches; succession and seller authority; possession/boundary evidence',asset='land',role='purchaser',kind='due_diligence',notes=TITLE_NOTE)
ax('Deed registration and state stamp-duty assessment','PROPERTY_REGISTRATION','Registration Act 1908 and applicable state stamp/registration law','Instrument requiring registration; deed type, execution place, property situs and exemptions control liability.','Ordinary section 23 presentation limit: four months from execution; statutory exceptions and state amendments require review.',['transaction','location'],'AX_REG','Executed instrument; parties/authority and identity; property schedule; stamp-duty and registration-fee evidence',asset='land',role='transferee',notes='No uniform India-wide stamp rate. Online drafting/payment/booking does not prove no SRO attendance, witnesses or identity verification. Record current procedure per instrument.')
ax('Land-use and purchaser eligibility screening','LAND_RECORDS','Applicable state tenure, land-reform, planning and special-area law','Land purchase/change of use; investigate agricultural eligibility, tribal/protected land, tenancy, ceiling, lease conditions and acquisition restrictions.','Before contract, transfer or change of use.',['location','transaction','industry'],'AX_DOLR','Parcel classification; buyer eligibility; tenure/lease terms; planning designation; permissions',asset='land',role='purchaser',kind='due_diligence',notes='Research checklist only; the directory does not establish any particular state restriction. Each applicable provision remains a state/property-level verification task.')
ax('NRI / OCI immovable property acquisition eligibility','FEMA','FEMA Non-Debt Instruments Rules and RBI immovable-property guidance','Person resident outside India acquiring Indian property; citizenship/OCI, asset class and purchase/gift/inheritance mode matter.','Before acquisition and remittance.',['transaction','location'],'AX_NRI_LAND','Residence/citizenship or OCI evidence; property classification; acquisition mode; funds/banking evidence',asset='land',role='nonresident_acquirer',entities=['individual'],notes='General NRI/OCI purchase permission excludes agricultural land, plantation property and farmhouse. Inheritance and other routes require separate analysis; do not infer an absolute ban on all modes of acquisition.')

ROR={
 'AN':'https://dweepbhoomi.andamannicobar.gov.in/','AP':'https://meebhoomi.ap.gov.in/','AR':'','AS':'https://ilrms.assam.gov.in/','BR':'https://biharbhumi.bihar.gov.in/','CH':'https://revenue.chd.gov.in/','CG':'https://bhuiyan.cg.nic.in/','DN':'https://sugam.dddgov.in/','DL':'https://dlrc.delhi.gov.in/','GA':'https://dslr.goa.gov.in/','GJ':'https://anyror.gujarat.gov.in/','HR':'https://jamabandi.nic.in/','HP':'https://himbhoomilmk.nic.in/','JK':'https://jkrevenue.nic.in/','JH':'https://jharbhoomi.jharkhand.gov.in/','KA':'https://landrecords.karnataka.gov.in/','KL':'https://revenue.kerala.gov.in/','LA':'https://landrecords.ladakh.gov.in/lalr','LD':'https://land.utl.gov.in/','MP':'','MH':'https://mahabhumi.gov.in/','MN':'https://louchapathap.nic.in/','ML':'','MZ':'','NL':'','OD':'https://bhulekh.ori.nic.in/','PY':'https://nilamagal.py.gov.in/public/','PB':'https://revenue.punjab.gov.in/','RJ':'https://apnakhata.raj.nic.in/','SK':'https://ilrms.sikkim.gov.in/','TN':'https://eservices.tn.gov.in/','TG':'https://bhubharati.telangana.gov.in/','TR':'https://jami.tripura.gov.in/','UP':'https://upbhulekh.gov.in/','UK':'https://bhulekh.uk.gov.in/','WB':'https://banglarbhumi.gov.in/'}
LOCAL={
 'WB':('Khatian; plot/dag; Khajna','AX_WB_REV'), 'BR':('Jamabandi; Bhu Lagan; Parimarjan','AX_BR'),
 'MH':('7/12; 8A; Ferfar; Property Card','AX_MH'), 'TN':('Patta; Chitta; FMB; Integrated Land Record','AX_TN'),
 'KA':('RTC; mutation record','AX_KA'), 'TG':('Pattadar; Bhu Bharati mutation','AX_TG'), 'PY':('Nilamagal land records','AX_PY')}
PROPERTY_TOPICS=['property_ror','property_mutation','land_revenue','deed_registration','encumbrance_title','land_use_eligibility','boundary_survey','property_tax']
for code,name,level in STATES:
    sid=LOCAL.get(code,('', 'AX_DOLR'))[1]
    mutation=ROR[code] if code in ['WB','BR','MH','KA','TG'] else ''
    revenue=ROR[code] if code in ['WB','BR'] else ('https://www.revenue.kerala.gov.in/revenueportalbeta/index.php' if code=='KL' else '')
    route='directory_listed_endpoint_not_tested' if ROR[code] else 'route_unresolved'
    if code=='MP': route='directory_link_held_for_authenticity_review'
    note='Verify current tenure, protected/tribal-area, agricultural-buyer, ceiling, conversion and lease restrictions for the parcel; no eligibility inferred.'
    if code=='MP': note+=' DoLR links mpbhulekhrecords.com; application URL withheld pending official endpoint authentication.'
    add('state_property_profiles',property_profile_id='PROP-'+code,jurisdiction_id='IN-'+code,record_terms=LOCAL.get(code,('Local terminology unresolved',sid))[0],terms_status='source_scoped' if code in LOCAL else 'unresolved',ror_url=ROR[code],registration_url='https://epathirapathivu.py.gov.in/' if code=='PY' else '',mutation_url=mutation,land_revenue_url=revenue,source_id='AX_DOLR',service_source_id='AX_KL' if code=='KL' else sid,route_status=route,physical_steps_status='unverified',restriction_review=note,title_note=TITLE_NOTE,checked_on=SCAN_DATE)
    for topic in PROPERTY_TOPICS:
        add('state_coverage',coverage_id=code+'-'+topic,jurisdiction_id='IN-'+code,topic=topic,applicability_status='property_and_transaction_dependent',authority_url=ROR[code],application_url=ROR[code] if topic=='property_ror' else '',source_id=sid if topic=='property_ror' else '',coverage_status='directory_routing_only' if topic=='property_ror' and ROR[code] else 'research_required',next_verification='Resolve current local law, competent office, applicant/parcel eligibility, fees, documents, deadlines and physical steps. '+note)

def property_rule(code,name,topic,sid,applies,docs,**kw):
    rid=ax(name,'LAND_RECORDS','Applicable state land/revenue law and current service procedure',applies,kw.pop('deadline','Use current statutory period or actual demand/order; no universal annual date inferred.'),kw.pop('triggers',['transaction','location']),sid,docs,asset='land',jur='IN-'+code,scope='state',**kw)
    cov=next(c for c in TABLES['state_coverage'] if c['coverage_id']==code+'-'+topic)
    cov.update(coverage_status='partial_rule_research',source_id=sid,application_url=next(p['application_url'] for p in TABLES['process_profiles'] if p['rule_id']==rid))
    add('coverage_rules',coverage_rule_id=rid+'-COV',coverage_id=cov['coverage_id'],rule_id=rid)
    auth='AUTH-AX-'+code+'-LAND'
    if not any(a['authority_id']==auth for a in TABLES['authorities']):
        add('authorities',authority_id=auth,name=next(s[1] for s in STATES if s[0]==code)+' competent land/revenue office',jurisdiction_id='IN-'+code,website_url=ROR[code],source_id=sid,verification_status='service_route_partial')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid)['authority_id']=auth
    return rid
property_rule('WB','West Bengal mutation of land records','property_mutation','AX_WB_MUT','Transfer/succession or other record-change event requiring mutation.','Deed/succession basis; parcel and recorded-party details; current checklist',mode='online',notes=TITLE_NOTE)
property_rule('WB','West Bengal land revenue / Khajna application and payment','land_revenue','AX_WB_REV','Recorded holding with assessed land revenue demand.','Khatian; plot/dag; share and land-use details; demand and payment receipt',mode='online',triggers=['date','notice','transaction'],notes='Land revenue is distinct from municipal holding/property tax; reconcile the correct plot, payer and demand period.')
for name,topic,applies,docs in [
 ('Bihar mutation application','property_mutation','Transfer or succession requiring record update.','Deed/inheritance basis; parcel and applicant details'),
 ('Bihar Bhu Lagan land revenue payment','land_revenue','Holding with land revenue liability.','Jamabandi reference; demand period and challan/receipt'),
 ('Bihar Jamabandi correction / Parimarjan','property_ror','Error in digitised land record eligible for correction.','Existing record; discrepancy and supporting original/certified evidence'),
 ('Bihar land possession certificate','property_ror','Applicant needing possession certification for a permitted purpose.','Parcel details; possession basis; current service checklist'),
 ('Bihar land conversion application','land_use_eligibility','Proposed use change within the conversion regime.','Title/tenure evidence; parcel map; proposed use and project documents')]:
    property_rule('BR',name,topic,'AX_BR',applies,docs,mode='online',kind='conditional_service' if 'certificate' in name or 'correction' in name else 'mandatory_if_applicable',notes='Official FAQ lists service; exact eligibility, documents, fee and physical verification are not fully researched.')
property_rule('MH','Maharashtra digitally signed land-record extracts','property_ror','AX_MH','Person requiring authenticated 7/12, 8A, Ferfar or Property Card for relevant parcel.','Survey/record identifiers; requested record type',mode='online',kind='due_diligence',notes='Use appropriate authenticated extract; a free screen view and a certified record may have different evidentiary uses. '+TITLE_NOTE)
property_rule('MH','Maharashtra e-Hakk mutation application','property_mutation','AX_MH','Covered land record change requiring mutation; check whether registration already initiated it.','Record identifiers; event supporting documents; applicant/holder details',mode='online',notes='Do not file a duplicate application if the registered transaction already initiated mutation; check status and current service category.')
property_rule('KA','Karnataka RTC mutation and record review','property_mutation','AX_KA','Ownership or other change recorded in RTC under the applicable Karnataka revenue procedure.','RTC and survey identifiers; transfer/succession records; mutation reference',mode='online_or_assisted',website=ROR['KA'],notes=TITLE_NOTE)
property_rule('TN','Tamil Nadu integrated record and patta-history review','property_ror','AX_TN','Buyer/holder reviewing textual rights and survey records before property transaction.','Survey/subdivision identifiers; patta and FMB; transfer history',kind='due_diligence',mode='online',website=ROR['TN'],notes='NIC service announcement supports record access; no fixed patta-transfer deadline or visit-free mutation is asserted.')
property_rule('KL','Kerala land revenue assessment and remittance','land_revenue','AX_KL','Holding with applicable revenue demand; village and digital-survey rollout determine service route.','Survey/holding references; assessment/demand; prior receipt',mode='online',triggers=['date','notice'],notes='Verify whether the parcel uses ReLIS or a newer integrated system. Separate land tax, building tax and local-body property tax.')
property_rule('TG','Telangana Bhu Bharati pending mutation','property_mutation','AX_TG','Eligible pending mutation case under the current Bhu Bharati service.','Property and transaction details; pending mutation reference; current checklist',mode='online',website=ROR['TG'],notes='Use Bhu Bharati current instructions; do not automatically reuse old Dharani procedure.')
property_rule('TG','Telangana prohibited-property check for registration','land_use_eligibility','AX_TG_RULE','Proposed transaction covered by registration/mutation procedure; examine section 22A prohibited-property status.','Parcel details; prohibited-list result; any competent release/order',kind='due_diligence',notes='A missing match is not a title guarantee; exceptions and removal require competent authority process.')
property_rule('HP','Himachal section 118 permission screening','land_use_eligibility','AX_HP','Land transaction or change of use that falls within section 118; buyer category and exemptions must be established.','Purchaser eligibility; parcel/use details; previous permission and conditions if any',mode='online_or_assisted',notes='Service inventory confirms permission routes only; it does not establish that all outsiders are barred or all non-agriculturists must use the same form.')

# Excise: never infer permission to sell alcohol merely from business incorporation.
BUSINESS_ENTITIES=[x[0] for x in ENTITIES if x[0] not in ['individual','huf']]
for code,sid,name,applies in [
 ('DL','AX_DL_EX','Delhi hotel / club liquor licence selection','Hotel, restaurant or club proposing liquor service; select actual notified category and current policy.'),
 ('MH','AX_MH_EX','Maharashtra FL-II retail liquor licence','Proposed or existing retail activity within FL-II; verify whether new grant/transfer is available under policy.'),
 ('CG','AX_CG_EX','Chhattisgarh restaurant / hotel bar licence','Premises within current restaurant/hotel bar category; eligibility and local permission matter.'),
 ('BR','AX_BR_EX','Bihar prohibition and permitted-activity screening','Any proposed liquor possession, supply, manufacture, transport or service; evaluate current prohibition law and narrowly applicable permissions.')]:
    rid=ax(name,'EXCISE','Applicable state excise/prohibition Act, rules and current policy',applies,'Before activity; actual licence/permit conditions govern continued operation.',['industry','location','licence','law_change'],sid,'Applicant/entity; premises rights and site particulars; proposed product/activity; current category checklist',asset='liquor_premises',jur='IN-'+code,scope='state',entities=BUSINESS_ENTITIES,kind='conduct_restriction' if code=='BR' else 'mandatory_if_applicable',notes='Do not extrapolate availability, fees, dry days, sale ages or licence validity across states. Current category and grant policy need review.')
    cov=next(c for c in TABLES['state_coverage'] if c['coverage_id']==code+'-excise')
    cov.update(coverage_status='partial_rule_research',source_id=sid)
    add('coverage_rules',coverage_rule_id=rid+'-COV',coverage_id=cov['coverage_id'],rule_id=rid)
for name,applies,sid,triggers in [
 ('West Bengal excise grant / renewal','Manufacturer, wholesaler or retailer within an available licensed category.','AX_WB_EX',['industry','location','licence']),
 ('West Bengal liquor brand / label registration','Supplier placing a covered liquor brand or label in the state market.','AX_WB_EX',['industry','transaction','licence']),
 ('West Bengal excise import / movement permit','Covered liquor/spirit movement requiring a permit/pass; commodity and origin/destination determine route.','AX_WB_EX',['transaction','location']),
 ('West Bengal temporary bar permission','Event/premises seeking temporary liquor-service permission.','AX_WB_TEMP',['transaction','location'])]:
    rid=ax(name,'EXCISE','West Bengal excise law, rules and current service conditions',applies,'Before grant-dependent activity/movement/event; renewal follows current certificate/policy. ',triggers,sid,'Applicant and licence details; premises/event/product/consignment particulars as applicable; current service checklist',asset='liquor_premises',jur='IN-WB',scope='state',entities=BUSINESS_ENTITIES,mode='online',inspection='conditional' if 'grant' in name else 'unverified',notes='Online request is evidenced; original-document, site-verification and category-specific physical steps remain separately unresolved.')
    cov=next(c for c in TABLES['state_coverage'] if c['coverage_id']=='WB-excise')
    cov.update(coverage_status='partial_rule_research',source_id=sid)
    add('coverage_rules',coverage_rule_id=rid+'-COV',coverage_id=cov['coverage_id'],rule_id=rid)

# Additional review coverage for licences mentioned in commercial discovery. These
# are gaps, deliberately not manufactured statutory obligations.
for code,name,level in STATES:
    add('state_coverage',coverage_id=code+'-hospitality_special_permissions',jurisdiction_id='IN-'+code,topic='hospitality_special_permissions',applicability_status='unresolved_activity_and_locality_specific',source_id='AX_IF_REST',coverage_status='secondary_discovery_only',next_verification='Check current local eating-house/hotel/lodging/entertainment permissions and repeal/deregulation orders. Separate food, fire, liquor and trade licences already catalogued; do not copy a universal police-licence claim.')

# Both land and building transactions reuse common transfer and tax frameworks.
for rid in ASSET_ADDITIONS:
    rows=[x for x in TABLES['rule_asset_scopes'] if x['rule_id']==rid and x['asset_class_id']=='land']
    if rows and rid in ['AX011-V1','AX012-V1','AX014-V1']:
        add('rule_asset_scopes',rule_asset_scope_id=rid+'-building',rule_id=rid,asset_class_id='building',actor_role=rows[0]['actor_role'],mapping_status='candidate_context_not_final_eligibility')
for rid in ['C060-V1','C060-V2']:
    for aid in ['land','building']:
        add('rule_asset_scopes',rule_asset_scope_id=rid+'-'+aid,rule_id=rid,asset_class_id=aid,actor_role='payer_or_transferee',mapping_status='candidate_context_not_final_eligibility')

for field,typ,scope,desc in [
 ('investor_tax_residency','enum','person/period','Tax resident/NR/RNOR category; distinct from FEMA residence'),
 ('fema_residency','enum','person/date','FEMA residence and relevant change date'),
 ('citizenship_oci_status','enum','person/date','Citizenship/OCI and relevant permission category'),
 ('investor_role','enum','person/account','Retail holder, insider, designated person, adviser, analyst or acquirer'),
 ('security_instrument_class','enum','asset','Equity, debt, unit, derivative or other instrument'),
 ('security_trade_records','json','asset/transaction','Acquisition/sale dates and costs, proceeds, STT and corporate actions'),
 ('shareholding_pac_history','json','issuer/date','Voting rights, holdings and persons acting in concert'),
 ('lrs_fy_remitted_usd','decimal','person/financial_year','Aggregate remittances for all LRS purposes'),
 ('property_local_identifiers','json','property','District, tehsil/taluk, village/mouza, khata/khatian, dag/khasra/survey, subdivision and ULPIN when available'),
 ('property_tenure_class','enum','property/date','Freehold, leasehold, grant or other tenure; not inferred from a tax receipt'),
 ('property_land_use','enum','property/date','Revenue classification and actual/proposed use recorded separately'),
 ('property_title_evidence','json','property','Deed chain, seller authority, encumbrances, litigation and possession checks'),
 ('property_mutation_status','enum','property/event','Pending, ordered, appealed, rejected or record-updated; does not certify title'),
 ('property_revenue_demands','json','property/period','Demand type, assessed period, payer, amount and receipt; land revenue separate from municipal tax'),
 ('property_permission_conditions','json','property','Buyer/use eligibility, authority order and continuing conditions'),
 ('excise_activity_class','enum','premises','Retail, wholesale, manufacture, storage, event or movement'),
 ('excise_product_and_route','json','premises/transaction','Product class; origin/destination; permit and licence details')]:
    add('business_profile_fields',field_id=field,data_type=typ,scope=scope,description=desc,required_for='Asset/investor/property/excise assessment; profile must identify the correct legal person')
# Follow-up checks resolve a misleading directory link and selected smaller-state gaps.
FOLLOWUP=[
 ('AX_MP_ROUTE','https://sidhi.nic.in/en/service/land-records/','MP official district land-record route','Official district page identifies mpbhulekh.gov.in'),
 ('AX_AR_ROUTE','https://lisa.arunachal.gov.in/','Arunachal land information system','Land Holding Certificate lookup'),
 ('AX_AR_LPC','https://services.india.gov.in/service/detail/apply-for-issue-of-land-possession-certificate-arunachal-pradesh-1','Arunachal land possession service','Department of Land Management certificate service'),
 ('AX_ML_MUT','https://www.meghalaya.gov.in/services/content/36145','Meghalaya mutation service','Online mutation, inheritance, sale and record-change service'),
 ('AX_ML_LAW','https://meghalaya.gov.in/sites/default/files/acts/Land_Transfer_Act.pdf','Meghalaya Transfer of Land Act','Previous sanction for covered transfers involving non-tribal transferees; exceptions and prohibited areas matter'),
 ('AX_MZ_LAW','https://landrevenue.mizoram.gov.in/uploads/attachments/46892c52320cf011549a0e8e392a2ea0/the-mizoram-land-revenue-rules-2013-.pdf','Mizoram Land Revenue Rules 2013','Mutation/partition framework; current amendments and channel unresolved'),
 ('AX_MCD_TAX','https://mcdonline.nic.in/ptrmcd/web/citizen/info?loginActive=R','MCD property tax citizen portal','Online property-tax service and tax-due certificate'),
 ('AX_WB_REG','https://wbregistration.gov.in/%28S%28yolxckiitgguqggt0ehu1vnp%29%29/writereaddata/Documents/steps%20of%20registration.pdf','West Bengal registration process','e-Requisition for market-value, stamp-duty and registration-fee assessment')]
for sid,url,title,supports in FOLLOWUP:
    source(sid,url,title,supports,kind='official_research')
    next(s for s in TABLES['sources'] if s['source_id']==sid)['accessed_on']=SCAN_DATE
for code,url,sid,terms in [('MP','https://mpbhulekh.gov.in/','AX_MP_ROUTE','Local extract terminology requires confirmation'),('AR','https://lisa.arunachal.gov.in/','AX_AR_ROUTE','Land Holding Certificate')]:
    ROR[code]=url
    p=next(p for p in TABLES['state_property_profiles'] if p['jurisdiction_id']=='IN-'+code)
    p.update(ror_url=url,service_source_id=sid,record_terms=terms,terms_status='source_scoped' if code=='AR' else 'unresolved',route_status='official_route_identified_endpoint_not_tested')
    if code=='MP': p['restriction_review']='DoLR directory .com link superseded here by official district-confirmed mpbhulekh.gov.in. Current parcel restrictions remain unresolved.'
    c=next(c for c in TABLES['state_coverage'] if c['coverage_id']==code+'-property_ror')
    c.update(authority_url=url,application_url=url,source_id=sid,coverage_status='directory_routing_only',next_verification=p['restriction_review'])
property_rule('AR','Arunachal land possession certificate application','property_ror','AX_AR_LPC','Applicant requiring land possession certification within current service eligibility.','Parcel and applicant identity; possession/allotment evidence; current checklist',kind='conditional_service',notes='Certificate service is confirmed; exact mandatory documents and physical verification are unresolved. '+TITLE_NOTE)
property_rule('ML','Meghalaya mutation / inheritance record-change application','property_mutation','AX_ML_MUT','Covered mutation, inheritance, sale or other record-change case.','Recorded land details; transfer/succession basis; party information',mode='online',notes='Official directory confirms online service; coverage by land tenure and competent office requires verification.')
property_rule('ML','Meghalaya land-transfer prior-sanction review','land_use_eligibility','AX_ML_LAW','Transfer from tribal to non-tribal or non-tribal to non-tribal within the Act; check definitions, exceptions and area prohibitions.','Transferor/transferee status; parcel/tenure; proposed instrument; sanction application',deadline='Obtain required sanction before covered transfer.',notes='Do not equate non-tribal with non-resident. Review current amendments and competent authority for the parcel.')
property_rule('MZ','Mizoram mutation / partition and settlement-record update','property_mutation','AX_MZ_LAW','Covered change to settlement/lease or recorded holding under land revenue rules.','Existing settlement/lease record; transfer/succession/partition basis; parcel details',notes='Rule framework only; current fee, forms, exceptions and online availability have not been confirmed.')
rid=ax('MCD property-tax assessment, return and payment','MUNICIPAL','Delhi Municipal Corporation law and current annual tax schedule','Taxable property within MCD jurisdiction; owner/occupier and property category determine liability.','Use applicable FY schedule, demand and extensions; no generic rebate date is treated as universal due date.',['date','transaction','notice'],'AX_MCD_TAX','Property ID; use, area and construction particulars; ownership/occupation; assessment and prior payments',asset='building',jur='IN-DL-MCD',scope='local',mode='online',notes='MCD only; NDMC, cantonment and other states need independent rules. Separate municipal tax from revenue khajana.')
add('coverage_rules',coverage_rule_id=rid+'-COV',coverage_id='DL-property_tax',rule_id=rid)
next(c for c in TABLES['state_coverage'] if c['coverage_id']=='DL-property_tax').update(coverage_status='partial_rule_research',source_id='AX_MCD_TAX',next_verification='MCD sample only. Verify tax-year assessment, deadlines, exemptions and other Delhi local bodies.')
rid=ax('West Bengal deed e-Requisition and stamp assessment','PROPERTY_REGISTRATION','West Bengal stamp/registration framework and current registration procedure','Proposed instrument for registration in West Bengal; assess property value, deed class and parties.','Before registration/payment; check assessment-slip validity and current rates.',['transaction','location'],'AX_WB_REG','Deed and party details; land/building valuation particulars; assessment/payment reference',asset='land',jur='IN-WB',scope='state',mode='online',website='https://wbregistration.gov.in/',notes='Online assessment step only. Registration completion, originals, witnesses and attendance must be verified separately.')
add('coverage_rules',coverage_rule_id=rid+'-COV',coverage_id='WB-deed_registration',rule_id=rid)
next(c for c in TABLES['state_coverage'] if c['coverage_id']=='WB-deed_registration').update(coverage_status='partial_rule_research',source_id='AX_WB_REG',application_url='https://wbregistration.gov.in/')
next(p for p in TABLES['state_property_profiles'] if p['jurisdiction_id']=='IN-WB')['registration_url']='https://wbregistration.gov.in/'
next(p for p in TABLES['state_property_profiles'] if p['jurisdiction_id']=='IN-ML').update(mutation_url='https://www.meghalaya.gov.in/services/content/36145',service_source_id='AX_ML_MUT',route_status='mutation_service_identified_ror_unresolved')
# Assign a state/local authority to every state excise/registration sample.
for r in TABLES['rule_versions']:
    if r['rule_id'] not in ASSET_ADDITIONS or r['jurisdiction_id']=='IN': continue
    if r['authority_id'].startswith('AUTH-AX-'): continue
    c=next(c for c in TABLES['compliances'] if c['compliance_id']==r['compliance_id'])
    aid='AUTH-AX-'+r['jurisdiction_id']+'-'+c['department_id']
    if not any(a['authority_id']==aid for a in TABLES['authorities']):
        p=next(p for p in TABLES['process_profiles'] if p['rule_id']==r['rule_id'])
        sid=next(e['source_id'] for e in TABLES['evidence_assertions'] if e['rule_id']==r['rule_id'])
        add('authorities',authority_id=aid,name=r['jurisdiction_id']+' competent '+c['department_id']+' authority',jurisdiction_id=r['jurisdiction_id'],website_url=p['application_url'],source_id=sid,verification_status='service_route_partial')
    r['authority_id']=aid
assert len(TABLES['state_property_profiles'])==36
