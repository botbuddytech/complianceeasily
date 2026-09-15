"""IndiaFilings gap scan, 15 September 2026. Secondary discovery is not legal verification."""
SCAN_DATE='2026-09-15'
DISCOVERIES=[
 ('IF-FLA','https://www.indiafilings.com/learn/what-is-fla-return','FLA return'),
 ('IF-FLA-OLD','https://www.indiafilings.com/learn/fla-return-filing','FLA article with legacy email procedure'),
 ('IF-PAS6','https://www.indiafilings.com/learn/form-pas-6','PAS-6 reconciliation'),
 ('IF-SH7','https://www.indiafilings.com/learn/eform-sh-7','Share capital alteration'),
 ('IF-ADT3','https://www.indiafilings.com/learn/removal-or-change-of-auditor-of-company','Auditor resignation'),
 ('IF-APEDA','https://www.indiafilings.com/learn/apeda-registration','APEDA registration'),
 ('IF-DARPAN','https://www.indiafilings.com/darpan-registration','NGO Darpan'),
 ('IF-GSTCANCEL','https://www.indiafilings.com/gst/cancellation','GST cancellation'),
 ('IF-GSTR10','https://www.indiafilings.com/learn/gstr-10-filing','GST final return'),
 ('IF-LLP24','https://www.indiafilings.com/learn/llp-form-24-easily-close-a-llp','LLP strike-off'),
 ('IF-STK2','https://www.indiafilings.com/learn/strike-off-company','Company strike-off'),
 ('IF-DORMANT','https://www.indiafilings.com/dormant-company','Dormant status and return'),
 ('IF-TMREPLY','https://www.indiafilings.com/trademark-objection/trademark-objection-process-explained-for-india','Trademark examination reply'),
 ('IF-TMOPPOSE','https://www.indiafilings.com/trademark-opposition','Trademark opposition'),
 ('IF-STARTUP','https://www.indiafilings.com/start-up-india','DPIIT recognition'),
 ('IF-REVIVE','https://www.indiafilings.com/learn/company-revival-procedure','Company restoration'),
 ('IF-HOME','https://www.indiafilings.com/','Core service groups')]
for sid,url,title in DISCOVERIES:
    source(sid,url,'IndiaFilings: '+title,'Secondary discovery only; government source governs conflicting legal/procedural claims',kind='secondary_commercial')
OFFICIAL=[
 ('RBI_FLA_CURRENT','https://www.rbi.org.in/Scripts/FAQView.aspx?Id=95','RBI FLA FAQs','Applicability, July 15, FLAIR; special AIF route; revision permission','opened_page'),
 ('MCA_PAS6','https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction%20Kit_PAS-6.pdf','MCA PAS-6 instruction kit','Half-year reconciliation within sixty days; source excerpt, direct open failed','search_excerpt'),
 ('MCA_SH7','https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction%20Kit_SH-7.pdf','MCA SH-7 instruction kit','Purpose-specific capital alteration and attachments','search_excerpt'),
 ('MCA_ADT3','https://www.mca.gov.in/Ministry/pdf/NCARules_Chapter10.pdf','MCA Audit and Auditors Rules','ADT-3 resignation form; use current webform interface','search_excerpt'),
 ('APEDA_CURRENT','https://apeda.gov.in/sites/default/files/documents/2026-06/Registration_Procedure.pdf','APEDA registration procedure','DGFT e-RCMC, five-year validity and applicant-specific documents','search_excerpt'),
 ('APEDA_FAQ','https://apeda.gov.in/APEDA-FAQ','APEDA FAQ','RCMC via DGFT since 17 July 2023','search_excerpt'),
 ('NITI_DARPAN','https://www.niti.gov.in/divisions/cell/voluntary-action-cell','NITI Aayog Voluntary Action Cell','Darpan ID grant/FCRA/banking-related requirements','search_excerpt'),
 ('GST_WELCOME','https://tutorial.gst.gov.in/downloads/news/welcome_kit_for_new_taxpyers.pdf','GSTN taxpayer welcome kit','Final return within three months of later cancellation/order date','search_excerpt'),
 ('MCA_LLP24','https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction_Kit_LLP_Form_No_24.pdf','MCA LLP Form 24 kit','Strike-off eligibility, cessation date, regulator NOC','search_excerpt'),
 ('MCA_MSC3','https://www.mca.gov.in/MCA21/dca/help/instructionkit/NCA/Form_MSC-3_help.pdf','MCA MSC-3 instruction kit','Dormant return within thirty days of FY end; legacy interface details','search_excerpt'),
 ('DPIIT_2026','https://www.dpiit.gov.in/static/uploads/2026/02/119e52e2a36f652215a32c3ccc5f9c66.pdf','DPIIT notification 108(E), 4 February 2026','Revised normal/deep-tech thresholds and recognised entity classes','search_excerpt'),
 ('STARTUP_ROUTE','https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html','Startup India recognition services','NSWS recognition application; separate tax-benefit eligibility','search_excerpt')]
for sid,url,title,supports,method in OFFICIAL: source(sid,url,title,supports,method=method)
for s in TABLES['sources']:
    if s['source_id'] in {x[0] for x in DISCOVERIES+OFFICIAL}: s['accessed_on']=SCAN_DATE

IF_SCAN=[]
def gap(n,name,dept,law,applies,deadline,triggers,discovery,official,docs,form='',**kw):
    cid=f'IF{n:03d}'
    conflict=kw.pop('conflict','No specific conflict identified; unresolved exceptions and physical steps remain marked for review.')
    assertions=[(discovery,'discovery','IndiaFilings identified this missing topic; legal conclusions are not based on the commercial page alone.')]
    assertions+=official
    rid=new_rule(cid,name,dept,law,applies,deadline,triggers,documents=docs,sources=assertions,**kw)
    next(r for r in TABLES['rule_versions'] if r['rule_id']==rid).update(form_code=form,checked_on=SCAN_DATE)
    # Commercial evidence must not appear as government verification.
    for e in TABLES['evidence_assertions']:
        if e['rule_id']==rid and e['source_id']==discovery: e['verification_status']='secondary_discovery_only'
    IF_SCAN.append(dict(compliance_id=cid,rule_id=rid,topic=name,decision='added',indiafilings_url=next(s['url'] for s in TABLES['sources'] if s['source_id']==discovery),official_source_urls='|'.join(dict.fromkeys(next(s['url'] for s in TABLES['sources'] if s['source_id']==sid) for sid,_,_ in official)),conflict_or_scope_note=conflict,checked_on=SCAN_DATE))
    return rid

gap(1,'Annual foreign liabilities and assets return','FEMA','FEMA and RBI annual FLA reporting requirements','Entities covered by RBI FLA FAQ, including eligible companies/LLPs with outstanding inward/outward direct investment at year end; distinguish special AIF procedure.','15 July of reporting year. Provisional figures may be used; obtain FLAIR permission to revise as described in current FAQ.',['date','transaction'],'IF-FLA',[
 ('RBI_FLA_CURRENT','applicability_text','Outstanding FDI/ODI and entity class determine reporting, not only fresh investment.'),('RBI_FLA_CURRENT','deadline_text','Annual deadline is July 15; FAQ permits provisional filing and a requested revision.'),('RBI_FLA_CURRENT','filing_mode','Ordinary entity filing uses FLAIR; AIF format/procedure differs.')],
 'Financial statements; investment/shareholding data; FLAIR verification and authority letters for registration',form='FLA',entities=companies+['llp','partnership','other'],frequency='annual',website='https://flair.rbi.org.in/',mode='online',conflict='IndiaFilings pages disagree between FLAIR and the legacy email-Excel route. RBI current FAQ controls; do not impose the article universal September 30 revision deadline.')
gap(2,'Half-yearly share capital reconciliation — PAS-6','MCA','Companies (Prospectus and Allotment of Securities) Rules 9A/9B','Companies covered by applicable dematerialisation rules; assess unlisted public/private class, exclusions, relevant financial-year status and transition.','Within 60 days of each applicable half-year end; verify period-specific relaxations.',['date','transaction','law_change'],'IF-PAS6',[
 ('MCA_PAS6','deadline_text','Kit specifies sixty days after half-year conclusion.'),('MCA_PAS6','filing_mode','MCA webform and professional certification are documented.')],
 'ISIN and depository balances; issued/listed/physical/demat capital reconciliation; professional certification',form='PAS-6',entities=companies,frequency='half_yearly',website='https://www.mca.gov.in/',mode='online',notes='Do not activate from current turnover alone. Rule 9B transition and changed small-company status need separate legal review.',conflict='Topic confirmed; the full private-company transition and exemptions remain unresolved rather than copied wholesale.')
gap(3,'Notice of alteration of share capital','MCA','Companies Act section 64; Share Capital and Debentures Rules','Applicable capital alteration, increase/consolidation/division or specified redemption events; purpose controls attachments.','Section 64 ordinarily requires notice within 30 days of alteration/increase/redemption; evaluate exact event.',['transaction'],'IF-SH7',[
 ('MCA_ACT','deadline_text','Section 64 provides capital-event notice period.'),('MCA_SH7','filing_mode','SH-7 is an MCA webform with purpose-dependent fields.')],
 'Resolution; altered memorandum/articles where relevant; capital breakdown; tribunal order where applicable',form='SH-7',entities=companies,website='https://www.mca.gov.in/',mode='online')
gap(4,'Auditor resignation notice','AUDIT','Companies Act section 140(2); Companies (Audit and Auditors) Rules, rule 8','Resigning auditor must file; company workflow should track receipt and replacement separately.','Within 30 days of resignation; additional CAG communication where section 140 applies.',['transaction'],'IF-ADT3',[
 ('MCA_ACT','deadline_text','Section 140(2) sets thirty-day resignation statement period.'),('MCA_ADT3','documents','ADT-3 includes auditor identity, reasons and relevant facts; signature by auditor/partner.')],
 'Resignation letter; auditor identity and membership/firm details; reasons and relevant facts',form='ADT-3',entities=companies,website='https://www.mca.gov.in/',mode='online',notes='Legal filer is the auditor, not automatically the company or its director.')
gap(5,'APEDA scheduled-product exporter registration / renewal','DGFT','APEDA Act and current e-RCMC procedure','Exporters of APEDA scheduled agricultural/processed-food products; distinguish merchant and manufacturer category.','Obtain applicable registration for scheduled-product export; certificate validity is five years under current procedure. Confirm exact initial statutory clock.',['industry','licence','transaction'],'IF-APEDA',[
 ('APEDA_CURRENT','documents','IEC copy; manufacturer category needs relevant manufacturing proof.'),('APEDA_CURRENT','deadline_text','Published procedure states five-year validity.'),('APEDA_FAQ','application_url','APEDA uses DGFT e-RCMC since July 17, 2023.')],
 'Signed/sealed IEC; product-specific manufacturing evidence for manufacturer or combined category',form='e-RCMC — APEDA',website='https://www.dgft.gov.in/CP/index.jsp?opt=e-rcmc',mode='online',conflict='IndiaFilings article describes one-time/no-renewal registration and the older APEDA route; official procedure states five years and DGFT e-RCMC. Generic C080 does not encode this product-specific requirement.')
gap(6,'NGO / NPO Darpan unique ID','NGO','NITI Aayog Darpan requirements; applicable grant, FCRA and PML records framework','NPOs needing Darpan ID for central grants, relevant FCRA/tax applications or bank account requirements. Separate bank duty from NPO application prerequisites.','Before the relevant application/account process requires the ID; keep registration particulars current.',['transaction','industry'],'IF-DARPAN',[
 ('NITI_DARPAN','applicability_text','NITI identifies central-grant, FCRA and account-related requirements; do not equate Darpan with NGO incorporation.')],
 'Entity registration and PAN particulars; governing-body and contact details; current portal checklist',form='Darpan Unique ID',entities=ngos,website='https://www.niti.gov.in/divisions/cell/voluntary-action-cell',mode='online',notes='Guidance URL; follow NITI current portal link. Do not assume Darpan substitutes for CSR-1 or tax registration.',conflict='Commercial page blanket CSR-funding claim not adopted as a separately verified universal requirement.')
gap(7,'GST registration cancellation application','GST','CGST Act section 29 and applicable registration rules','Registered person seeking cancellation on legally permitted grounds; transfers, cessation and exemptions need separate assessment.','Determine event and statutory application period; outstanding obligations survive cancellation where law requires.',['transaction','location'],'IF-GSTCANCEL',[
 ('GST_WELCOME','framework_or_procedure','GST cancellation and final return are distinct processes; full REG-16 eligibility/timing remains for review.')],
 'GSTIN; reason and event date; stock/liability particulars; supporting cessation/transfer evidence',form='REG-16',website='https://www.gst.gov.in/',mode='unverified',notes='Government entry point supplied; specific cancellation workflow still needs direct procedure verification.')
gap(8,'GST final return after cancellation','GST','CGST Act section 45; CGST Rules rule 81','Cancelled registrations within section 45 scope. Check taxpayer category and statutory exclusions; not a universal return for every GST registration class.','Within three months of cancellation date or cancellation-order date, whichever is later; applicable extensions require review.',['transaction','date'],'IF-GSTR10',[
 ('GST_WELCOME','deadline_text','GSTN specifies the later of cancellation and order dates.')],
 'Cancellation order and effective date; stock and capital-goods details; tax liability/payment records',form='GSTR-10',website='https://www.gst.gov.in/',mode='online',conflict='IndiaFilings learn article says earlier and overgeneralises taxpayers; GSTN uses later. Added qualified scope, not the blanket claim.')
gap(9,'LLP voluntary strike-off application','LLP','LLP Rules rule 37 and applicable amendments','Eligible inactive LLP electing strike-off, after checking liabilities, filings, inactivity period and regulator consent.','Application only after applicable eligibility period; not a recurring annual obligation.',['transaction'],'IF-LLP24',[
 ('MCA_LLP24','applicability_text','Kit restricts filing before one year of cessation and identifies regulator NOC cases.'),('MCA_LLP24','filing_mode','Form 24 is an MCA webform.')],
 'Statement of accounts; partner consent; declarations/affidavits and indemnities as applicable; regulator NOC for regulated activity',form='LLP-24',entities=['llp'],kind='optional_exit_procedure',website='https://www.mca.gov.in/',mode='online',testing='conditional',notes='Execution of declarations and any notarisation remain separate from online submission.')
gap(10,'Company voluntary strike-off application','MCA','Companies Act sections 248/249; Removal of Names Rules','Eligible company electing removal after liabilities and statutory restrictions are addressed.','Event-based; satisfy eligibility and required filings before application.',['transaction'],'IF-STK2',[
 ('MCA_ACT','applicability_text','Sections 248/249 govern voluntary removal and restrictions.'),('MCA_PORTAL','filing_mode','MCA lists STK-2 with C-PACE electronic filing.')],
 'Statement of accounts; member approvals; indemnities/affidavits; liability and litigation disclosures; applicable regulatory approvals',form='STK-2',entities=companies,kind='optional_exit_procedure',website='https://www.mca.gov.in/',mode='online',testing='conditional',notes='Section 8 and regulated-company restrictions require review; candidate entity mapping is not approval of eligibility.')
gap(11,'Apply for dormant company status','MCA','Companies Act section 455; Companies (Miscellaneous) Rules','Eligible company electing formal dormant status; simple inactivity does not itself confer approved dormant status.','Optional event-based application after eligibility review.',['transaction'],'IF-DORMANT',[
 ('MCA_ACT','applicability_text','Section 455 permits dormant status for qualifying companies.')],
 'Company approvals; activity and financial particulars; required consents/certifications',form='MSC-1',entities=companies,kind='optional_status_procedure',website='https://www.mca.gov.in/',mode='online',notes='Detailed current MSC-1 checklist remains indicative.')
gap(12,'Dormant company annual return','MCA','Companies Act section 455; Companies (Miscellaneous) Rules','Companies with dormant status subject to prescribed annual return; other event filings may still apply.','Within 30 days of financial-year end; verify current notifications and applicable period.',['date'],'IF-DORMANT',[
 ('MCA_MSC3','deadline_text','Instruction kit uses FY end plus thirty days.')],
 'Audited statement of financial position; dormant-status and director particulars; prescribed declarations',form='MSC-3',entities=companies,frequency='annual',website='https://www.mca.gov.in/',mode='online',notes='Legacy instruction kit supports deadline, not proof every current portal screen is unchanged.')
gap(13,'Trademark examination-report response','IP','Trade Marks Rules 2017 rule 33','Applicant receiving an examination report requiring response.','Respond within one month of receipt under rule 33; actual service and case directions matter.',['notice'],'IF-TMREPLY',[
 ('TM_RULES','deadline_text','Rule 33(4) permits abandonment treatment if no response within one month.')],
 'Examination report; ground-wise response; relevant use/supporting evidence; agent authorisation as applicable',form='Examination report reply',website='https://ipindia.gov.in/pages/e-services',mode='online',visit='conditional',testing='conditional',notes='Hearings and affidavit requirements are case-specific; online filing is not a no-physical-step guarantee.')
gap(14,'Trademark opposition counterstatement','IP','Trade Marks Act section 21; Trade Marks Rules 2017 rule 44','Applicant served with opposition and wishing to defend registration; distinguish initiating opposition and later evidence stages.','TM-O counterstatement within two months of receipt of notice copy from Registrar.',['notice'],'IF-TMOPPOSE',[
 ('TM_RULES','deadline_text','Rule 44 defines counterstatement form and two-month receipt-based clock.')],
 'Opposition notice and service evidence; counterstatement; applicant/agent authority; subsequent evidence separately required',form='TM-O — counterstatement',website='https://ipindia.gov.in/pages/e-services',mode='online',visit='conditional',testing='conditional')
gap(15,'DPIIT startup recognition','MSME','DPIIT Gazette notification GSR 108(E), 4 February 2026','Eligible private company, registered partnership, LLP or cooperative meeting innovation/original-entity and age/turnover conditions; recognition is optional for relevant benefits.','Apply while eligible; recognition is distinct from separate tax-benefit approval.',['industry','turnover','transaction'],'IF-STARTUP',[
 ('DPIIT_2026','turnover_basis','Notification sets normal ceiling INR 200 crore and recognised Deep Tech ceiling INR 300 crore; equality is included.'),('STARTUP_ROUTE','application_url','Recognition application routed through NSWS.')],
 'Entity incorporation/registration evidence; innovation/scalability explanation; authorised contact; current supporting documents',form='Registration as a Startup',entities=['private_company','partnership','llp','other'],kind='optional_benefit',turnover='Normal: no FY since incorporation exceeding INR 200 crore; recognised Deep Tech: INR 300 crore. Separate age and activity tests; tax exemption has distinct eligibility.',website='https://www.nsws.gov.in/',mode='online',conflict='IndiaFilings still displays INR 100 crore. Gazette 108(E) sets INR 200/300 crore with normal/deep-tech distinctions. Exact boundary taken from Gazette rather than inconsistent portal summary.')
gap(16,'Restoration of struck-off company / order filing','MCA','Companies Act section 252 and applicable NCLT procedure','Eligible applicant pursuing restoration; appeal/application standing and limitation differ.','Case-specific section 252 limitation and tribunal-order compliance; do not assign one deadline to every applicant.',['notice','transaction'],'IF-REVIVE',[
 ('MCA_ACT','applicability_text','Section 252 provides distinct restoration routes.'),('MCA_PORTAL','application_url','MCA identifies INC-28 restoration filing with NCLT order and proof of ordered costs where applicable.')],
 'Petition and supporting records; NCLT order; proof of costs/compliance; current ROC filings as directed',form='NCLT petition / INC-28',entities=companies,kind='optional_remedial_procedure',website='https://www.mca.gov.in/',mode='hybrid_case_dependent',visit='conditional',testing='conditional',notes='MCA is the order-filing route; tribunal petition and hearing procedure are separate.')

# Record already-covered items to make deduplication reviewable.
for cid,topic in [('C001','GST registration'),('C020','AOC-4 annual accounts'),('C021','Company annual return'),('C023','Director KYC'),('C064','PF monthly contribution/ECR'),('C094','Trademark registration')]:
    IF_SCAN.append(dict(compliance_id=cid,rule_id=cid+'-V1',topic=topic,decision='already_covered_no_duplicate',indiafilings_url='https://www.indiafilings.com/',official_source_urls='',conflict_or_scope_note='Existing entry retained; commercial marketing does not upgrade its evidence status.',checked_on=SCAN_DATE))
assert len({x['compliance_id'] for x in IF_SCAN if x['decision']=='added'})==16
for n,aid,name,url,sid in [
 (1,'AUTH-RBI-FLA','Reserve Bank of India — FLA reporting','https://flair.rbi.org.in/','RBI_FLA_CURRENT'),
 (5,'AUTH-APEDA','APEDA — e-RCMC through DGFT','https://apeda.gov.in/','APEDA_FAQ'),
 (6,'AUTH-NITI-DARPAN','NITI Aayog — Voluntary Action Cell / NPO Darpan','https://www.niti.gov.in/divisions/cell/voluntary-action-cell','NITI_DARPAN'),
 (15,'AUTH-DPIIT','DPIIT — Startup India recognition','https://www.startupindia.gov.in/','STARTUP_ROUTE')]:
    add('authorities',authority_id=aid,name=name,jurisdiction_id='IN',website_url=url,source_id=sid,verification_status='source_scoped')
    next(r for r in TABLES['rule_versions'] if r['rule_id']==f'IF{n:03d}-V1')['authority_id']=aid
next(r for r in TABLES['rule_versions'] if r['rule_id']=='IF004-V1')['authority_id']='AUTH-MCA'
