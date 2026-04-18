"""
Rich mock data for demo/fallback when LLM quota is exceeded.
FAST-NUCES themed, high variance across all fields.
"""
import uuid
from datetime import datetime, timedelta

def get_mock_result(session_id: str, total_scanned: int = 15) -> dict:
    today = datetime.utcnow()

    ranked_opportunities = [
        {
            "email_id": "email_003",
            "is_opportunity": True,
            "classification_confidence": 0.97,
            "classification_reason": "HEC scholarship with clear eligibility and application deadline",
            "title": "HEC Need-Based Scholarship 2026 — STEM Track",
            "organization": "Higher Education Commission Pakistan",
            "opportunity_type": "SCHOLARSHIP",
            "deadline": (today + timedelta(days=3)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "BS/MS enrolled student at HEC-recognized university",
                "CGPA ≥ 3.0 on 4.0 scale",
                "Pakistani national",
                "Household income below PKR 45,000/month"
            ],
            "required_documents": [
                "Official transcript (last 2 semesters)",
                "Income certificate from Union Council",
                "Domicile certificate",
                "2 passport-size photographs",
                "CNIC copy"
            ],
            "application_link": "https://hec.gov.pk/scholarships/need-based",
            "contact_email": "scholarships@hec.gov.pk",
            "stipend_or_benefit": "PKR 12,000/month + tuition waiver (up to PKR 80,000/semester)",
            "location": "Pakistan (All HEC-recognized universities)",
            "days_remaining": 3,
            "urgency_score": 0.98,
            "fit_score": 0.95,
            "fit_evidence": [
                "Your CGPA 3.53 comfortably exceeds the minimum 3.0 requirement",
                "FAST-NUCES Lahore is an HEC-recognized institution",
                "Pakistani nationality satisfies the citizenship requirement",
                "STEM (Computer Science) directly qualifies under the STEM Track"
            ],
            "fit_gaps": [],
            "why_this_matters": "With only 3 days left and a near-perfect profile match, this is your highest-priority action right now. Your CGPA and CS background make you a strong candidate for the STEM track.",
            "completeness_score": 0.95,
            "priority_score": 0.967,
            "priority_rank": 1,
            "action_steps": [
                "Download your official transcript from FAST student portal (portal.nu.edu.pk) — select last 2 semesters",
                "Obtain income certificate from your local Union Council office (bring family CNIC)",
                "Submit application at hec.gov.pk/scholarships/need-based — deadline is in 3 days",
                "Email scholarships@hec.gov.pk with subject 'HEC Need-Based 2026 — FAST-NUCES' to confirm receipt"
            ]
        },
        {
            "email_id": "email_007",
            "is_opportunity": True,
            "classification_confidence": 0.94,
            "classification_reason": "Google Summer of Code paid internship with clear technical requirements",
            "title": "Google Summer of Code 2026 — AI/ML Projects",
            "organization": "Google Open Source",
            "opportunity_type": "INTERNSHIP",
            "deadline": (today + timedelta(days=12)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "Currently enrolled university student (any year)",
                "18+ years old",
                "Proficient in at least one programming language",
                "Available 10–40 hours/week for 12 weeks"
            ],
            "required_documents": [
                "Project proposal (4–8 pages)",
                "GitHub profile or code portfolio",
                "University enrollment letter",
                "Resume/CV"
            ],
            "application_link": "https://summerofcode.withgoogle.com",
            "contact_email": "gsoc-admins@google.com",
            "stipend_or_benefit": "USD $3,000–$6,600 depending on project size (Standard/Medium/Large)",
            "location": "Remote (Global)",
            "days_remaining": 12,
            "urgency_score": 0.85,
            "fit_score": 0.92,
            "fit_evidence": [
                "Your Python and LangChain skills directly align with AI/ML GSoC projects",
                "MIT Hack Nation Global AI Hackathon win demonstrates open-source project capability",
                "Remote work format suits your location in Lahore",
                "No citizenship restrictions — open to Pakistani students"
            ],
            "fit_gaps": [
                "Highly competitive (5000+ applicants globally) — requires a standout proposal"
            ],
            "why_this_matters": "GSoC would give you paid international experience building AI tools — directly relevant to your LangChain and ML interests, and a strong CV booster for graduate school applications.",
            "completeness_score": 0.92,
            "priority_score": 0.894,
            "priority_rank": 2,
            "action_steps": [
                "Browse GSoC 2026 organizations at summerofcode.withgoogle.com/organizations — filter by AI/ML tag",
                "Write a 6-page project proposal: problem statement, timeline, deliverables, your relevant experience",
                "Push a sample contribution (even 1 PR) to your target org's GitHub before submitting",
                "Submit proposal at summerofcode.withgoogle.com before the 12-day deadline"
            ]
        },
        {
            "email_id": "email_011",
            "is_opportunity": True,
            "classification_confidence": 0.96,
            "classification_reason": "DAAD fellowship with full funding for German university research",
            "title": "DAAD Research Internship for Undergraduates (RISE) 2026",
            "organization": "DAAD — German Academic Exchange Service",
            "opportunity_type": "FELLOWSHIP",
            "deadline": (today + timedelta(days=28)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "Undergraduate student (not in final year)",
                "CGPA equivalent to German grade 2.0 or better (≈ 3.0+ GPA)",
                "Strong academic background in STEM",
                "Basic English proficiency (German not required)"
            ],
            "required_documents": [
                "CV (max 2 pages, Europass format)",
                "Transcript of Records",
                "Motivation letter (1 page)",
                "2 recommendation letters from professors",
                "English proficiency certificate"
            ],
            "application_link": "https://www.daad.de/rise",
            "contact_email": "rise@daad.de",
            "stipend_or_benefit": "EUR 650/month + travel allowance (up to EUR 1,800) + accommodation",
            "location": "Germany (various research labs)",
            "days_remaining": 28,
            "urgency_score": 0.72,
            "fit_score": 0.88,
            "fit_evidence": [
                "Your CGPA 3.53 exceeds the minimum equivalent of 3.0",
                "STEM (Computer Science) qualifies for RISE program",
                "Not in final year (Semester 6 of 8) — meets eligibility",
                "Research assistant experience makes your application competitive"
            ],
            "fit_gaps": [
                "Requires 2 professor recommendation letters — plan 2 weeks to collect them"
            ],
            "why_this_matters": "DAAD RISE would give you a summer in a German research lab — perfect for your research interests and a powerful differentiator for MS/PhD applications at top universities.",
            "completeness_score": 0.91,
            "priority_score": 0.812,
            "priority_rank": 3,
            "action_steps": [
                "Request recommendation letters from 2 professors today — they need 2 weeks minimum",
                "Download Europass CV template from europass.europa.eu and fill it in",
                "Write a 1-page motivation letter focusing on your AI/ML research goals and German lab preference",
                "Submit complete application at daad.de/rise before the 28-day deadline"
            ]
        },
        {
            "email_id": "email_002",
            "is_opportunity": True,
            "classification_confidence": 0.91,
            "classification_reason": "MIT AI competition with prize money and visibility",
            "title": "MIT Hack Nation Global AI Challenge — Spring 2026",
            "organization": "MIT Media Lab",
            "opportunity_type": "COMPETITION",
            "deadline": (today + timedelta(days=45)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "University students globally",
                "Teams of 1–4 members",
                "AI/ML project focus required",
                "English submission"
            ],
            "required_documents": [
                "Project demo video (3 minutes max)",
                "GitHub repository (public)",
                "2-page technical writeup",
                "Team member details"
            ],
            "application_link": "https://hacknation.mit.edu/apply",
            "contact_email": "hacknation@mit.edu",
            "stipend_or_benefit": "1st place: $15,000 + MIT mentorship | 2nd: $8,000 | 3rd: $4,000",
            "location": "Remote (Final round: MIT Cambridge, USA)",
            "days_remaining": 45,
            "urgency_score": 0.60,
            "fit_score": 0.93,
            "fit_evidence": [
                "You WON this exact competition last year — you know the format and judging criteria",
                "Your LangChain and ML skills align perfectly with AI challenge requirements",
                "Defending champion status gives you a credibility advantage",
                "No GPA requirements — judged purely on technical merit"
            ],
            "fit_gaps": [
                "Need to form a new team or prepare solo — coordinate early"
            ],
            "why_this_matters": "You literally won this last year. Defending your title would be an extraordinary story for your CV, graduate school applications, and the SOFTEC demo today.",
            "completeness_score": 0.89,
            "priority_score": 0.756,
            "priority_rank": 4,
            "action_steps": [
                "Register your team at hacknation.mit.edu/apply (open now — no deadline pressure yet)",
                "Adapt your previous winning project or brainstorm a new AI concept with 3× the impact",
                "Set up a public GitHub repo and begin committing prototype code this week",
                "Submit video demo + writeup 3 days before the 45-day deadline for final polish time"
            ]
        },
        {
            "email_id": "email_009",
            "is_opportunity": True,
            "classification_confidence": 0.89,
            "classification_reason": "UN Youth volunteer program with international exposure",
            "title": "UN Volunteers — Digital Innovation for Sustainable Development",
            "organization": "United Nations Volunteers (UNV)",
            "opportunity_type": "FELLOWSHIP",
            "deadline": (today + timedelta(days=60)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "Age 18–29",
                "University student or recent graduate",
                "Interest in ICT4D or digital solutions for development",
                "English proficiency required"
            ],
            "required_documents": [
                "UN Volunteer profile (onlinevolunteering.org)",
                "CV (max 2 pages)",
                "Cover letter (1 page)",
                "University enrollment certificate"
            ],
            "application_link": "https://www.onlinevolunteering.org",
            "contact_email": "unv.digital@un.org",
            "stipend_or_benefit": "Certificate of completion + LinkedIn endorsement + potential UNV staff referral",
            "location": "Remote",
            "days_remaining": 60,
            "urgency_score": 0.48,
            "fit_score": 0.78,
            "fit_evidence": [
                "Age 20 fits the 18–29 bracket",
                "Full-Stack Development and AI skills applicable to digital innovation projects",
                "Remote work format accessible from Lahore",
                "Aligns with your interest in using technology for impact"
            ],
            "fit_gaps": [
                "Unpaid — no financial stipend, only certification and networking",
                "Competitive with 50,000+ annual applicants globally"
            ],
            "why_this_matters": "UN volunteer experience adds international NGO credibility to your profile — valuable for fellowship and scholarship applications that value social impact.",
            "completeness_score": 0.82,
            "priority_score": 0.623,
            "priority_rank": 5,
            "action_steps": [
                "Create your UN Volunteer profile at onlinevolunteering.org (takes 20 minutes)",
                "Search for 'AI' or 'digital' assignments and bookmark 3 that match your skills",
                "Write a 1-page cover letter emphasizing your React/FastAPI skills for digital projects",
                "Submit application and set a reminder to follow up in 2 weeks"
            ]
        },
        {
            "email_id": "email_014",
            "is_opportunity": True,
            "classification_confidence": 0.87,
            "classification_reason": "FAST-NUCES departmental research grant for final-year projects",
            "title": "FAST CS Department Undergraduate Research Grant 2026",
            "organization": "FAST-NUCES Lahore — CS Department",
            "opportunity_type": "SCHOLARSHIP",
            "deadline": (today + timedelta(days=90)).strftime("%Y-%m-%d"),
            "eligibility_criteria": [
                "FAST-NUCES enrolled BS CS student",
                "Semester 5 or above",
                "Minimum CGPA 3.0",
                "Proposed research in AI, Security, or Systems"
            ],
            "required_documents": [
                "2-page research proposal",
                "Faculty supervisor endorsement letter",
                "Current transcript",
                "Budget justification (max PKR 50,000)"
            ],
            "application_link": "https://lhr.nu.edu.pk/cs/research-grants",
            "contact_email": "cs.research@lhr.nu.edu.pk",
            "stipend_or_benefit": "PKR 50,000 project grant + lab access + co-authorship on publication",
            "location": "FAST-NUCES Lahore",
            "days_remaining": 90,
            "urgency_score": 0.30,
            "fit_score": 0.97,
            "fit_evidence": [
                "FAST-NUCES Lahore student — mandatory eligibility requirement met",
                "Semester 6 meets the Semester 5+ requirement",
                "CGPA 3.53 exceeds 3.0 minimum by 18%",
                "AI research interest directly matches the grant's focus areas",
                "Your UG Research Assistant experience shows you can manage a research project"
            ],
            "fit_gaps": [
                "Need faculty supervisor endorsement — approach a professor proactively"
            ],
            "why_this_matters": "This is a near-perfect match — you meet every requirement and your existing research experience means you can write a strong proposal. Publication co-authorship would be a major CV boost.",
            "completeness_score": 0.88,
            "priority_score": 0.547,
            "priority_rank": 6,
            "action_steps": [
                "Email Dr. [your preferred supervisor] today requesting to supervise your AI research proposal",
                "Draft a 2-page research proposal on your AI/NLP project idea (use ACL template)",
                "Submit transcript + proposal at lhr.nu.edu.pk/cs/research-grants",
                "Follow up with cs.research@lhr.nu.edu.pk one week after submission"
            ]
        },
    ]

    near_miss_opportunities = [
        {
            "email_id": "email_005",
            "title": "Chevening Scholarship 2026–27 — UK Government",
            "organization": "UK Foreign Commonwealth & Development Office",
            "fit_score": 0.58,
            "deadline": (today + timedelta(days=20)).strftime("%Y-%m-%d"),
            "gaps": [
                "Requires minimum 2 years full-time work experience after graduation — you have 0 years",
                "Requires completed Bachelor's degree — you graduate in 2027"
            ],
            "bridge_message": "You're 58% there — Chevening is your target for 2028. Save this email and reapply after completing your BS and 2 years of industry work. Your profile otherwise fits perfectly."
        },
        {
            "email_id": "email_012",
            "title": "AWS Machine Learning Hero Program",
            "organization": "Amazon Web Services",
            "fit_score": 0.63,
            "deadline": (today + timedelta(days=35)).strftime("%Y-%m-%d"),
            "gaps": [
                "Requires demonstrated public AWS contributions (blog posts, talks, open-source)",
                "Prefers candidates with AWS certifications — you have none listed"
            ],
            "bridge_message": "You're 63% there — write 2 AWS-focused blog posts on Medium and take the AWS Cloud Practitioner exam (free prep available). Reapply in the next cohort."
        },
    ]

    reasoning_steps = [
        "[system] 🚀 Starting Opportunity Inbox Copilot...",
        "[system] 🔗 Connecting to LangGraph pipeline...",
        f"[dedup] Scanning {total_scanned} emails for duplicates...",
        "[dedup] Comparing subject similarity using 75% threshold...",
        f"[dedup] ✓ No duplicates found — all {total_scanned} emails are unique",
        f"[classifier] Batch-classifying all {total_scanned} emails in a single LLM call...",
        "[classifier] ✅ 'HEC Need-Based Scholarship 2026 — STEM Track' → OPPORTUNITY (97%) — clear scholarship with deadline",
        "[classifier] ✅ 'MIT Hack Nation Global AI Challenge — Spring 2026' → OPPORTUNITY (94%) — hackathon with prize money",
        "[classifier] 🗑️ 'Your Amazon order has shipped' → NOISE (99%) — purchase notification",
        "[classifier] ✅ 'Google Summer of Code 2026 — AI/ML Projects' → OPPORTUNITY (94%) — paid internship program",
        "[classifier] 🗑️ 'Weekly LinkedIn digest for you' → NOISE (98%) — social media notification",
        "[classifier] 🗑️ 'Grab 50% off this weekend only!' → NOISE (99%) — promotional spam",
        "[classifier] ✅ 'UN Volunteers — Digital Innovation for Sustainable Development' → OPPORTUNITY (89%) — fellowship",
        "[classifier] 🗑️ 'Your Careem ride receipt' → NOISE (99%) — payment receipt",
        "[classifier] ✅ 'DAAD Research Internship for Undergraduates (RISE) 2026' → OPPORTUNITY (96%) — fully funded fellowship",
        "[classifier] 🗑️ 'Hey bro are you coming to chai?' → NOISE (99%) — peer message",
        "[classifier] 🗑️ 'PTCL bill payment reminder' → NOISE (97%) — utility bill",
        "[classifier] 🗑️ 'Check out these summer deals at ChenOne' → NOISE (99%) — retail promotion",
        "[classifier] ✅ 'AWS Machine Learning Hero Program' → OPPORTUNITY (87%) — recognition program",
        "[classifier] 🗑️ 'Your Foodpanda order is on the way' → NOISE (99%) — food delivery notification",
        "[classifier] ✅ 'Chevening Scholarship 2026–27 — UK Government' → OPPORTUNITY (96%) — prestigious scholarship",
        "[classifier] 🗑️ 'Facebook: You have 3 new friend requests' → NOISE (99%) — social notification",
        "[classifier] 🗑️ 'University fee payment due' → NOISE (90%) — administrative notice",
        "[classifier] ✅ 'FAST CS Department Undergraduate Research Grant 2026' → OPPORTUNITY (87%) — departmental grant",
        "[classifier] 🗑️ 'Daraz.pk Flash Sale — 70% off Electronics' → NOISE (99%) — e-commerce spam",
        "[classifier] ✓ Complete — 8 opportunities, 13 noise emails filtered out of 21 total",
        "[extractor] Batch-extracting fields from 8 opportunities in one LLM call...",
        "[extractor] ✓ 'HEC Need-Based Scholarship 2026' — type: SCHOLARSHIP, deadline: 3 days",
        "[extractor] ✓ 'Google Summer of Code 2026' — type: INTERNSHIP, deadline: 12 days",
        "[extractor] ✓ 'DAAD Research Internship (RISE) 2026' — type: FELLOWSHIP, deadline: 28 days",
        "[extractor] ✓ 'MIT Hack Nation Global AI Challenge' — type: COMPETITION, deadline: 45 days",
        "[extractor] ✓ 'Chevening Scholarship 2026–27' — type: SCHOLARSHIP, deadline: 20 days",
        "[extractor] ✓ 'UN Volunteers Digital Innovation' — type: FELLOWSHIP, deadline: 60 days",
        "[extractor] ✓ 'AWS ML Hero Program' — type: OTHER, deadline: 35 days",
        "[extractor] ✓ 'FAST CS Research Grant 2026' — type: SCHOLARSHIP, deadline: 90 days",
        "[validator] Running hallucination checks on extracted fields...",
        "[validator] ✓ All 8 deadlines are future dates — valid",
        "[validator] ✓ All 6 application links resolve (HTTP 200)",
        "[validator] ✓ All 5 contact emails pass RFC 5322 validation",
        "[urgency] Computing deadline urgency scores with exponential decay...",
        "[urgency] 🔴 HEC Scholarship — 3 days → urgency: 0.98 (CRITICAL)",
        "[urgency] 🟠 Google GSoC — 12 days → urgency: 0.85 (HIGH)",
        "[urgency] 🟡 Chevening — 20 days → urgency: 0.78 (HIGH)",
        "[urgency] 🟡 DAAD RISE — 28 days → urgency: 0.72 (MEDIUM)",
        "[urgency] 🟢 AWS Hero — 35 days → urgency: 0.65 (MEDIUM)",
        "[urgency] 🟢 MIT Hack Nation — 45 days → urgency: 0.60 (MEDIUM)",
        "[urgency] 🔵 UN Volunteers — 60 days → urgency: 0.48 (LOW)",
        "[urgency] 🔵 FAST Research Grant — 90 days → urgency: 0.30 (LOW)",
        "[profile_matcher] Batch-matching 8 opportunities against Ali Hassan's profile in one LLM call...",
        "[profile_matcher] 'FAST CS Research Grant 2026' → fit: 97% (5 matches, 1 gap)",
        "[profile_matcher] 'MIT Hack Nation' → fit: 93% (4 matches, 1 gap)",
        "[profile_matcher] 'Google Summer of Code' → fit: 92% (4 matches, 1 gap)",
        "[profile_matcher] 'HEC Need-Based Scholarship' → fit: 95% (4 matches, 0 gaps)",
        "[profile_matcher] 'DAAD RISE Fellowship' → fit: 88% (4 matches, 1 gap)",
        "[profile_matcher] 'UN Volunteers Digital' → fit: 78% (4 matches, 2 gaps)",
        "[profile_matcher] 'Chevening Scholarship' → fit: 58% (2 matches, 2 gaps) — NEAR MISS",
        "[profile_matcher] 'AWS ML Hero Program' → fit: 63% (2 matches, 2 gaps) — NEAR MISS",
        "[near_miss] Detecting opportunities in 0.50–0.79 fit score range...",
        "[near_miss] ⚡ 'Chevening Scholarship' (58%) — flagged as near-miss: 2 years work experience gap",
        "[near_miss] ⚡ 'AWS ML Hero Program' (63%) — flagged as near-miss: no public AWS contributions",
        "[near_miss] ✓ 2 near-miss opportunities identified",
        "[scorer] Computing weighted priority scores: urgency(0.35) + fit(0.40) + completeness(0.25)...",
        "[scorer] 🥇 HEC Scholarship: urgency(0.98×0.35) + fit(0.95×0.40) + completeness(0.95×0.25) = 0.967",
        "[scorer] 🥈 Google GSoC: urgency(0.85×0.35) + fit(0.92×0.40) + completeness(0.92×0.25) = 0.894",
        "[scorer] 🥉 DAAD RISE: urgency(0.72×0.35) + fit(0.88×0.40) + completeness(0.91×0.25) = 0.812",
        "[scorer] 4th MIT Hack Nation: urgency(0.60×0.35) + fit(0.93×0.40) + completeness(0.89×0.25) = 0.756",
        "[scorer] 5th UN Volunteers: urgency(0.48×0.35) + fit(0.78×0.40) + completeness(0.82×0.25) = 0.623",
        "[scorer] 6th FAST Research Grant: urgency(0.30×0.35) + fit(0.97×0.40) + completeness(0.88×0.25) = 0.547",
        "[action_generator] Batch-generating action checklists for 6 opportunities in one LLM call...",
        "[action_generator] 'HEC Need-Based Scholarship' → 4 steps generated",
        "[action_generator] 'Google Summer of Code' → 4 steps generated",
        "[action_generator] 'DAAD RISE Fellowship' → 4 steps generated",
        "[action_generator] 'MIT Hack Nation' → 4 steps generated",
        "[action_generator] 'UN Volunteers Digital' → 4 steps generated",
        "[action_generator] 'FAST Research Grant' → 4 steps generated",
        "[ics_generator] Building .ics calendar file with 6 deadline events...",
        "[ics_generator] ✓ Calendar export ready — import to Google/Apple Calendar",
        "[report] Ranking final opportunities by priority score...",
        "[report] ✅ Pipeline complete — 6 actionable opportunities ranked, 2 near-misses identified",
        f"[report] 📊 Processed {total_scanned} emails → 8 real opportunities → 6 ranked + 2 near-misses",
        "[report] 🏆 Top priority: HEC Need-Based Scholarship (3 days left — act NOW)",
    ]

    return {
        "session_id": session_id,
        "total_scanned": total_scanned,
        "total_real": 8,
        "noise_count": total_scanned - 8,
        "dedup_count": 0,
        "ranked_opportunities": ranked_opportunities,
        "near_miss_opportunities": near_miss_opportunities,
        "reasoning_steps": reasoning_steps,
        "processing_complete": True,
        "_mock": True,
    }
