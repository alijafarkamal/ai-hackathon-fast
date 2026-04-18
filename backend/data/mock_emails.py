from datetime import date, timedelta
from models.email_models import RawEmail
_today = date.today()

MOCK_EMAILS = [
    RawEmail(
        id="email_real_001",
        subject="[URGENT] HEC Need-Based Scholarship 2025-26 — Deadline in 4 Days",
        sender="scholarships@hec.gov.pk",
        body="""Dear Student,

The Higher Education Commission of Pakistan is pleased to announce the
HEC Need-Based Scholarship Programme 2025-26 for undergraduate students
enrolled in HEC-recognized public sector universities.

AWARD:
  Full tuition fee waiver for remaining semesters
  Monthly stipend of PKR 6,000 for the full programme duration
  Scholarship renewed each semester based on academic standing

ELIGIBILITY:
  Pakistani national enrolled in a BS programme (4–5 year)
  Studying at an HEC-recognized public sector university
  Minimum CGPA of 2.0 out of 4.0
  Family monthly income below PKR 45,000
  No existing full scholarship from another source
  Self-finance seat holders are not eligible

REQUIRED DOCUMENTS:
  1. Official academic transcript (attested)
  2. Income certificate from Union Council (signed and stamped)
  3. CNIC copies of student and parent/guardian
  4. Domicile certificate
  5. Enrollment certificate from Registrar's Office
  6. Passport-size photograph (recent)

DEADLINE: 22 April 2026

Apply at:  https://scholarship.hec.gov.pk/apply
Contact:   scholarships@hec.gov.pk | 051-90402000

Incomplete or late applications will NOT be considered.

HEC Scholarships Division
Higher Education Commission of Pakistan, H-9, Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_002",
        subject="Generation Google Scholarship 2026 (APAC) — Applications Open",
        sender="scholarships-noreply@google.com",
        body="""Dear Computer Science Student,

Google invites applications for the Generation Google Scholarship 2026 for
Women in Computer Science, Asia Pacific region.

AWARD:
  USD 2,500 (approx. PKR 695,000) per scholar for academic year 2025-26
  One-time grant paid directly to the recipient

ELIGIBILITY:
  Identify as a woman (cisgender or transgender)
  Enrolled full-time in a Bachelor's programme at an APAC university
  In your 2nd or 3rd year of study during 2025-26
  Studying Computer Science, Computer Engineering, or a related technical field
  Demonstrates strong academic performance, leadership ability, and financial need
  Children of Google employees are not eligible

SELECTION CRITERIA:
  Academic excellence (transcripts required)
  Commitment to diversity, equity, and inclusion in tech
  Leadership and community impact

REQUIRED DOCUMENTS:
  Current academic transcript
  CV/Resume (max 2 pages)
  Two essay responses (500 words each)
  One recommendation letter from a faculty member or mentor

DEADLINE: 30 April 2026

Apply:   https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac
Contact: googlegenerationscholarship@iie.org

Google Scholarships Team""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_003",
        subject="Fulbright Master's & PhD Scholarship 2027 — Applications Opening Soon",
        sender="admissions@usefp.org",
        body="""Dear Prospective Applicant,

The United States Educational Foundation in Pakistan (USEFP) is pleased to
announce that the Fulbright Student Scholarship Programme for 2027 will open
for applications in December 2026, with a deadline of March 2027.

This is the US government's flagship scholarship — fully funded Master's and
PhD study at top US universities. Approximately 150 awards are made per year.

COVERAGE (FULLY FUNDED):
  Full tuition at a US university
  Monthly living stipend
  Round-trip airfare
  Health insurance
  Required textbooks

ELIGIBILITY:
  Pakistani citizen residing in Pakistan throughout the selection process
  For Master's: four-year Bachelor's degree (16 years of formal education)
  For PhD: Master's or M.Phil degree (18 years of formal education)
  Strong academic record; GRE General Test required
  English proficiency: TOEFL or IELTS
  All academic disciplines eligible except clinical medicine

INELIGIBLE APPLICANTS:
  Dual US/Pakistan nationals
  Persons already studying or on a visa abroad
  Prior Fulbright award recipients
  USAID/State Dept employees and their immediate family

TIMELINE:
  Applications open:  December 2026
  Deadline:           March 2027 (estimated — check usefp.org for exact date)
  Interviews:         June–August 2027
  Results:            September 2027
  Departure:          July 2028

REQUIRED DOCUMENTS (prepare now):
  GRE score report (send to codes 9388 USEFP and 2326 IIE)
  Academic transcripts (HEC-attested preferred)
  Statement of Purpose
  Three letters of recommendation
  CV/Resume
  Research proposal (for PhD applicants)

Register for updates: https://usefp.org/scholarships/fulbright-degree.cfm
Email: info@usefp.org

USEFP Fulbright Team, Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_004",
        subject="MLH Fellowship Summer 2026 — Rolling Admissions Closing Soon",
        sender="fellows@mlh.io",
        body="""Dear Aspiring Software Engineer,

The MLH (Major League Hacking) Fellowship Summer 2026 cohort is filling fast.
This is a fully remote, 12-week internship alternative for students who want
real-world software engineering experience.

Summer 2026 batch starts: 18 May 2026

TRACKS AVAILABLE:
  Software Engineering — Collaborate on real projects with our corporate partners
  Open Source — Contribute to open-source projects used by millions
  Production Engineering — Learn Site Reliability Engineering / DevOps

WHAT YOU GET:
  Educational stipend (amount varies by country of residence)
  Mentorship from engineers at top tech companies
  Daily standups, code reviews, and pair programming
  Real pull requests merged into production or major open-source repos
  Resume and interview coaching from career experts
  Certificate of completion

ELIGIBILITY:
  Must be 18 years or older
  Open to residents of all countries not under US embargo (Pakistan qualifies)
  Intermediate to advanced skill in at least one programming language
  Available 20–30 hours per week during the 12-week programme

SELECTION PROCESS:
  1. Online application (resume + GitHub + essay questions)
  2. Code review of a submitted code sample
  3. Initial 15-minute interview with a program coordinator
  4. Technical interview with a mentor

NOTE: Rolling admissions — seats fill continuously. Do not wait for the
deadline. Apply as early as possible. Strong candidates typically complete
interviews by mid-April.

DEADLINE: 30 April 2026 (apply now — pods fill before deadline)

Apply:   https://fellowship.mlh.io
Email:   hello@mlh.io

MLH Fellowship Team, Major League Hacking""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_005",
        subject="DAAD Study Scholarship — Master's in Germany 2026/27 | Fully Funded",
        sender="scholarships@daad.de",
        body="""Dear Student,

The German Academic Exchange Service (DAAD) invites applications from
Pakistani students for its Study Scholarships for Master's programmes in
Germany, starting October 2026.

DAAD is one of the world's largest and most prestigious scholarship
organisations. Germany's public universities charge no tuition fees —
DAAD covers your living costs entirely.

MONTHLY STIPEND:
  EUR 992 per month for Master's students
  EUR 1,400 per month for PhD students
  Plus health insurance, travel subsidy, and study materials allowance

ELIGIBILITY:
  Bachelor's degree in a relevant field (minimum required GPA varies by programme)
  English or German proficiency (IELTS 6.0+ or DAAD-approved test for English-taught)
  Maximum 6 years since completion of last degree
  Preference given to candidates with relevant work/research experience
  Pakistani citizens are fully eligible — DAAD actively recruits from Pakistan

POPULAR FIELDS FOR PAKISTAN APPLICANTS:
  Computer Science / AI / Data Science
  Engineering (Electrical, Mechanical, Civil)
  Development Economics and Public Policy
  Environmental Sciences
  Architecture and Urban Planning

REQUIRED DOCUMENTS:
  Signed DAAD application form (Europass format CV)
  Motivation letter (2 pages max)
  Academic transcripts and degree certificates
  Two academic reference letters
  Language test scores
  Research/study plan

DEADLINE: 15 May 2026 (for October 2026 start)

Apply:      https://www.daad.de/stipdb-redirect/
DAAD Pakistan: https://www.daad.pk
Contact:    daad-pakistan@daad.de | +92-51-2206179

DAAD Information Centre, Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_006",
        subject="MIT Solve 10th Anniversary Global Challenge 2026 — Win Up to $150,000",
        sender="solve-challenges@mit.edu",
        body="""Dear Innovator,

MIT Solve is celebrating 10 years of open innovation with its biggest
global challenge yet. Anyone worldwide can apply — including students.

WHAT IS MIT SOLVE?
Over 10 years: 100+ challenges, 26,800+ applications, $80M+ in funding,
solutions reaching 370 million people in 185 countries.

CHALLENGE TRACKS:
  Climate & Environment
  Health Systems & Wellbeing
  Learning & Economic Prosperity
  Technology & Community Trust

WHAT WINNERS GET:
  Up to $150,000 in prize funding per team
  Average payout in year one: $40,000
  9 months of tailored mentorship and capacity-building
  Attendance at Solve at MIT (Cambridge) and Solve Challenge Finals (NYC)
  MIT faculty connections and investor introductions
  Ongoing funding eligibility as a Solver alumnus

ELIGIBILITY:
  Anyone aged 13 or older, anywhere in the world
  Individuals, teams, or organisations all welcome
  Solutions at any stage: idea, prototype, or pilot
  Must be technology-based with clear potential for scale

DEADLINE: 21 May 2026 at 12:00 PM EDT

Apply:   https://solve.mit.edu/challenges
Contact: help@solve.mit.edu (3–5 business day response time)

MIT Solve Team, Massachusetts Institute of Technology""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_007",
        subject="LUMS MS Computer Science — Fall 2026 Application Deadline: 3 Days Left",
        sender="admissions@lums.edu.pk",
        body="""Dear Prospective Graduate,

This is a final reminder. The application deadline for LUMS MS Computer
Science (Fall 2026) is in 3 days.

PROGRAMME:
  LUMS SBASSE MS Computer Science — one of Pakistan's most rigorous
  graduate programmes. Research tracks include AI/ML, Computer Vision,
  Systems, HCI, and Theory.

ELIGIBILITY:
  BS in CS, Software Engineering, Computer Engineering, or closely related field
  HEC-recognized degree; equivalence certificate required from HEC for foreign degrees
  Students completing BS by 31 July 2026 may apply on 7th-semester results
  CGPA reviewed holistically (3.0+ competitive; exceptional cases reviewed on merit)

ADMISSION TESTS REQUIRED (both mandatory):
  LUMS Graduate Admission Test (LGAT) — Verbal, Quantitative, Analytical
  LUMS SBASSE Subject Test in Computer Science

REQUIRED DOCUMENTS:
  Online application form (fully completed)
  Official transcripts of all prior degrees
  Statement of Purpose: 500–1,000 words
  Two recommendation letters (submitted directly by referees)
  Updated CV/Resume
  Processing fee payment

APPLICATION DEADLINE: 21 April 2026 at 5:00 PM PKT
Document submission:  22 April 2026

Apply:    https://pgadmissions.lums.edu.pk
Queries:  Use the "Ask Admissions" portal on the LUMS website

Office of Admissions
Lahore University of Management Sciences
Sector U, DHA, Lahore Cantt 54792""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_008",
        subject="NUST MS Artificial Intelligence — Fall 2026 | GNET-II Open Now",
        sender="pgadmissions@nust.edu.pk",
        body="""Dear Prospective Student,

NUST (National University of Sciences and Technology, globally ranked
top 400 by QS) is accepting applications for MS Artificial Intelligence
for Fall 2026.

PROGRAMME:
  Offered by SEECS (School of Electrical Engineering and Computer Science)
  Covers: Machine Learning, Deep Learning, NLP, Computer Vision, RL, AI Ethics
  Strong industry-partnerships and active AI research labs on campus

ELIGIBILITY:
  BS in CS, Software Engineering, EE, Mathematics, Physics, or Data Science
  Minimum CGPA 2.0 out of 4.0 OR 55% marks (if CGPA not stated on transcript)
  One of the following entry tests (conducted after 1 June 2024):
    - NTS GAT General — minimum score 50
    - NUST GNET — minimum score 50
    - HEC HAT — minimum score 50
    - GRE General (international applicants)

GNET SERIES-II REGISTRATION:
  Now open for Fall 2026 applications
  Register at: https://pgadmission.nust.edu.pk — click "Apply for GNET"

REQUIRED DOCUMENTS:
  Attested degree certificate and transcripts
  Entry test score report
  CNIC copy
  Two reference letters
  SOP or research proposal (recommended, not mandatory)

APPLICATION DEADLINE: 14 May 2026

Apply:     https://pgadmission.nust.edu.pk
Helpline:  +92-51-9085-4300
Email:     pgadmissions@nust.edu.pk

Graduate Admissions Office
National University of Sciences and Technology (NUST), H-12, Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_009",
        subject="Arbisoft Summer Internship 2026 — ML/AI, Python & React Roles Open",
        sender="internships@arbisoft.com",
        body="""Hi,

Arbisoft — edX/MIT engineering partner with 1,000+ engineers globally — is
now accepting applications for its Summer Internship Programme 2026.

OPEN ROLES:
  Python / Django Backend Intern
  ML/AI Engineering Intern (Python, PyTorch, LangChain)
  Frontend React/TypeScript Intern
  Full-Stack Intern

DETAILS:
  Duration:  8–10 weeks (June–August 2026)
  Location:  Lahore (Hybrid — 3 days onsite, 2 days remote)
  Stipend:   PKR 30,000–50,000 per month based on role
  Conversion: High performers considered for PPO in Fresh Graduate Hiring

ELIGIBILITY:
  Enrolled in BS CS, Software Engineering, or related field
  Minimum Semester 5 completed at time of internship start
  Strong fundamentals: DSA, OOP, and at least one major project or prior internship

SELECTION PROCESS:
  1. Apply via email with CV + GitHub/Portfolio link
  2. Online technical screening (60 min)
  3. Technical interview with an Engineering Lead
  4. HR interview + offer

HOW TO APPLY:
  Email: internships@arbisoft.com
  Subject line: [Role] Intern — [Your Name] — [University] — Semester [N]
  Example: "ML/AI Intern — Sara Khan — FAST-NUCES — Semester 6"

DEADLINE: 27 April 2026 (rolling — early applicants reviewed first)

Questions: talent@arbisoft.com

People Operations & Development Team
Arbisoft, 5 Khayaban-e-Amin, DHA Phase 1, Lahore""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_010",
        subject="Systems Limited Trainee Engineer Programme 2026 — Apply Now",
        sender="careers@systemslimited.com",
        body="""Dear Graduate or Final-Year Student,

Systems Limited — Pakistan's largest IT company (PSX-listed, 3,500+
professionals, clients in 30+ countries) — invites applications for its
Trainee Engineer Programme 2026.

TRACKS:
  Software Development (Java, .NET, Python)
  AI / Machine Learning Engineering
  Cloud & DevOps Engineering
  Quality Assurance Automation

PROGRAMME DETAILS:
  Duration:  6 months structured training + mentorship
  Location:  Lahore, Karachi, or Islamabad (choose preference)
  Stipend:   PKR 45,000–65,000 per month (track and performance based)
  Conversion: Top performers receive permanent Software Engineer offers

ELIGIBILITY:
  BS CS, Software Engineering, or Computer Engineering (final year or recent grad)
  Expected graduation by August 2026
  Minimum CGPA 2.8 out of 4.0
  Strong fundamentals in algorithms, OOP, and software design patterns

SELECTION PROCESS:
  Online application + CV
  Technical aptitude assessment (90 minutes, online)
  Technical panel interview (virtual)
  HR interview + offer

APPLY:
  Website: https://systemslimited.com/careers
  OR email: jobs@systemslimited.com
  Subject: "Trainee Engineer 2026 — [Track] — [Name] — [University]"

DEADLINE: 6 May 2026

Human Resources
Systems Limited, 19-A Sector A, DHA Phase II, Lahore 54000""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_011",
        subject="NCAI Undergraduate Research Fellowship 2026 — AI/NLP Track | Stipend + Certificate",
        sender="fellowships@ncai.nust.edu.pk",
        body="""Dear Student,

The National Centre of Artificial Intelligence (NCAI) — Pakistan's premier
AI research body hosted at NUST, H-12 Islamabad — announces the Undergraduate
Research Fellowship Programme 2026 for the AI/ML Track.

FELLOWSHIP DETAILS:
  Duration:   12 weeks (July–September 2026)
  Location:   NCAI Lab, NUST H-12 (remote considered for exceptional candidates)
  Stipend:    PKR 25,000 per month
  Certificate: NCAI Research Fellowship Certificate — highly valued for
               MS/PhD applications locally and internationally

RESEARCH TRACKS:
  Natural Language Processing & Large Language Models
  Computer Vision & Medical AI
  Generative AI & Responsible AI
  Reinforcement Learning & Robotics

ELIGIBILITY:
  Enrolled in Semester 5, 6, or 7 of BS CS, SE, or EE
  Minimum CGPA 3.0 out of 4.0
  Pakistani national (priority to public university students)
  Python + ML framework experience (PyTorch or TensorFlow) required
  Prior research or published work is a strong advantage

REQUIRED DOCUMENTS:
  CV (max 2 pages, include GitHub/Google Scholar links)
  Unofficial academic transcript
  300-word research interest statement
  One faculty reference letter

SELECTION: Shortlisted candidates will be contacted for a 20-minute interview.
Results announced within 3 weeks of deadline.

DEADLINE: 9 May 2026

Apply:   https://ncai.nust.edu.pk/fellowships/2026-undergraduate
Email:   fellowships@ncai.nust.edu.pk

NCAI Fellowship Committee
National Centre of Artificial Intelligence, NUST, H-12, Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_012",
        subject="Devsinc Software Engineering Internship 2026 | Python, iOS, Android",
        sender="internships@devsinc.com",
        body="""Dear Student,

Devsinc — a global software development company with 2,000+ engineers in
Lahore and Islamabad, serving clients across USA, UK, and Australia — is
opening its Summer Internship Programme 2026.

PROGRAMME DETAILS:
  Duration:   8–10 weeks (June–August 2026)
  Location:   Lahore (Onsite) or Islamabad (Onsite)
  Stipend:    Paid (amount confirmed on offer)
  Format:     Full-time, immersive internship with project ownership

OPEN ROLES:
  Software Engineering Intern — Python
  Software Engineering Intern — iOS (Swift)
  Software Engineering Intern — Android (Kotlin)
  Web Development Intern — React / Node.js

ELIGIBILITY:
  Currently enrolled in a BS programme (CS, SE, or related)
  Minimum Semester 4 completed
  Basic project in one of the relevant technologies required

HOW TO APPLY:
  Step 1: Log in with your Gmail account at the application link below
  Step 2: Fill out the form — upload CV and latest transcript
  Step 3: Submit and await screening email

Apply:   https://apply.workable.com/devsinc-17/
Email for queries: hr@devsinc.com

DEADLINE: 4 May 2026

Devsinc HR Team
Devsinc, Main Boulevard, Gulberg III, Lahore""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_013",
        subject="Chief Minister's Honhaar Scholarship Programme 2026 — Undergraduate Batch",
        sender="scholarships@cmspunjab.gov.pk",
        body="""Dear Student,

The Government of Punjab announces the Chief Minister's Honhaar Undergraduate
Scholarship Programme 2026 for high-achieving students from public sector
universities across Punjab.

AWARD:
  Full tuition fee for remaining semesters of BS programme
  Monthly stipend of PKR 10,000 per month
  Laptop provided on selection (first batch only)

ELIGIBILITY:
  Enrolled in Semester 3 or above of a BS programme at a public sector
  university in Punjab (FAST-NUCES Lahore is included as a recognized institution)
  Minimum CGPA 3.5 out of 4.0 (merit-based — no income requirement)
  Pakistani national domiciled in Punjab
  Not receiving any other government scholarship

REQUIRED DOCUMENTS:
  Online application form (Punjab Scholarship Portal)
  Attested academic transcript
  Punjab domicile certificate
  CNIC copy (student + parent)
  Enrollment certificate from university

DEADLINE: 8 May 2026

Apply:   https://scholarship.punjab.gov.pk
Helpline: 0800-02345 (free call, Mon–Fri 9 AM to 5 PM)

Punjab Education Department
Government of Punjab, Lahore""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_014",
        subject="MLH Global Hackathon — April 2026 Weekend Edition | Online | Win Prizes",
        sender="hackathons@mlh.io",
        body="""Dear Hacker,

You are invited to the MLH Global Hackathon — April 2026 Weekend Edition.
Build something in 36 hours and win prizes, recognition, and job referrals.

DETAILS:
  Dates:    25–27 April 2026 (36-hour build window)
  Format:   Fully online, participate from anywhere in the world
  Team:     1–4 people per team
  Themes:   Open innovation — any tech project qualifies

PRIZES:
  1st Place:  USD 500 + interview fast-track at MLH partner companies
  2nd Place:  USD 250 + swag pack
  3rd Place:  USD 100 + swag pack
  Best AI Hack: Sponsored prize from partner company (TBD)
  Best First-Timer: Special mentorship + career coaching bundle

WHO SHOULD APPLY:
  Any student or early-career developer
  No experience threshold — first-timers actively encouraged
  Teams from Pakistan frequently win — time zone (PKT) aligns with the event

HOW TO JOIN:
  Register on Devpost: https://mlhglobalhack-april2026.devpost.com
  Join the Discord: discord.gg/mlh
  Show up on April 25 for the opening ceremony at 6:00 PM PKT

REGISTRATION DEADLINE: 25 April 2026 (day of event)

Questions: hi@mlh.io | MLH Discord support channel

MLH Events Team, Major League Hacking""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_015",
        subject="PIAIC Certified AI & Cloud Quarter — Free Batch 62 Registration Open",
        sender="training@piaic.org",
        body="""Dear Aspiring AI Engineer,

The Presidential Initiative for Artificial Intelligence and Computing (PIAIC)
is opening registration for Batch 62 of its Certified AI & Cloud Computing
programme — completely free of cost.

PROGRAMME:
  Pakistan's largest free AI education programme, supported by the
  Government of Pakistan, Aga Khan Fund, and industry partners

TRACKS AVAILABLE (choose one):
  Artificial Intelligence (Python, ML, Deep Learning, LLMs)
  Cloud-Native Computing (AWS, Docker, Kubernetes, Terraform)
  Web3 and Metaverse (Blockchain, Solidity, Next.js)
  Ambient Computing & IoT (Edge AI, Raspberry Pi, sensors)

SCHEDULE:
  Classes: Saturdays and Sundays, 9 AM to 12 PM
  Duration: 4 Quarters (approximately 12 months)
  Centres: Lahore (multiple), Karachi, Islamabad, Hyderabad, Peshawar

COST: Completely free. You only pay for your exam voucher if you want
      the optional certification exam.

ELIGIBILITY:
  Anyone 13 years or older
  Laptop required (minimum: 8GB RAM, 256GB storage)
  Basic computer literacy
  Commitment to attend all Saturday/Sunday sessions

HOW TO REGISTER:
  1. Visit: https://portal.piaic.org
  2. Select your city and track
  3. Complete the online quiz (basic aptitude check, not eliminatory)
  4. Submit registration before batch fills

REGISTRATION DEADLINE: 3 May 2026 (first-come, first-served — seats limited)

PIAIC Admissions Office
Presidential Initiative for Artificial Intelligence and Computing
Email: info@piaic.org""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_016",
        subject="Punjab Education Foundation (PEF) Graduate Scholarship 2026 — Now Accepting Applications",
        sender="scholarship@pefoundation.org.pk",
        body="""Dear Student,

The Punjab Education Foundation is pleased to announce the PEF Graduate
Scholarship Programme for 2026, targeting high-performing undergraduate
students from low-income backgrounds.

AWARD:
  PKR 60,000 per semester (tuition support)
  PKR 3,000 per month as a living stipend
  Duration: Remaining semesters of BS programme

ELIGIBILITY:
  Enrolled in a BS programme at an HEC-recognised university in Punjab
  Minimum CGPA 3.2 out of 4.0 (merit + need combined)
  Family monthly income below PKR 60,000
  Priority to first-generation university students (first in family to attend university)
  Punjab domicile required

REQUIRED DOCUMENTS:
  Online application (PEF portal)
  Income certificate from Union Council or NADRA
  Transcript (current semester)
  B-Form or CNIC
  Enrollment letter from Registrar

DEADLINE: 26 May 2026

Apply:   https://scholarship.pef.org.pk
Contact: scholarship@pefoundation.org.pk | 042-35761007

Punjab Education Foundation
7-B, Gulberg III, Lahore 54660""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_017",
        subject="i2c Inc — Junior Software Engineer (AI/ML Track) | Lahore | 2026 Batch",
        sender="careers@i2cinc.com",
        body="""Dear Candidate,

i2c Inc — a global fintech leader headquartered in Silicon Valley with a
1,000+ strong engineering team in Lahore — is hiring for its 2026 Junior
Software Engineer batch, AI/ML Track.

ABOUT i2c:
  Powers card programmes and payment platforms for 900+ clients in 200+ countries
  Offices in USA, Canada, and Pakistan
  Known for one of the highest engineer salaries in Pakistan

ROLE: Junior Software Engineer (AI/ML Track)
  Location:   Lahore (Onsite, DHA)
  Start Date: July 2026
  Salary:     Competitive — industry-leading for Pakistan (confirm on offer)
  Growth:     Structured 12-month learning path + promotion track

REQUIREMENTS:
  BS CS, SE, or EE from a reputable university (FAST, NUST, LUMS, COMSATS preferred)
  Graduation by June 2026
  Minimum CGPA 3.0 out of 4.0
  Solid Python skills + basic ML/DL understanding
  Familiarity with REST APIs and version control (Git)
  Strong problem-solving and communication skills in English

SELECTION PROCESS:
  1. Online aptitude test (60 min: logical + coding)
  2. Technical interview (Python + ML concepts)
  3. HR interview
  4. Offer

APPLY:
  Portal: https://www.i2cinc.com/who-we-are/supercharge-your-career/
  Subject (if emailing CV): "JuniorSE-AI 2026 — [Name] — [University]"
  Email: careers@i2cinc.com

DEADLINE: 2 May 2026

i2c Inc Talent Acquisition
i2c Inc, DHA Phase VI, Lahore""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_018",
        subject="SOFTEC 2026 — AI Hackathon, Programming Contest & Speaker Sessions | Register Now",
        sender="students@softecnu.org",
        body="""Dear FAST-NUCES Student,

SOFTEC 2026 — South Asia's largest student-run technology festival — is
returning to FAST-NUCES Lahore. This year's theme: "AI for Everyone."

EVENTS YOU CAN ENTER:
  AI Hackathon (24 hours, teams of 2–4, prizes up to PKR 200,000)
  Programming Contest (ICPC-style, individual or pair)
  Speed Debugging
  Database Design Competition
  Project Exhibition (showcase your FYP or personal project)

WHY ATTEND (even if not competing):
  Speaker sessions with CTOs and founders from top Pakistani startups
  Networking with 500+ CS students from 20+ universities
  Company booths: Arbisoft, i2c, Systems Limited, NetSol, and more
  On-spot hiring interviews with attending companies

VENUE:   FAST-NUCES Lahore, Faisal Town
DATES:   10–11 May 2026

REGISTRATION (for competitions):
  Register teams at: https://softecnu.org/register2026
  Walk-in attendance is free — no registration needed for the expo and talks

DEADLINES:
  AI Hackathon registration: 8 May 2026
  Programming Contest registration: 8 May 2026
  Project Exhibition submission: 5 May 2026

Contact: students@softecnu.org | Instagram: @softecnu

SOFTEC Organizing Committee, FAST-NUCES Lahore""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_019",
        subject="Amal Career-Prep Fellowship 2026 — 12-Week Remote Programme | Fully Funded",
        sender="fellowships@amalacademy.org",
        body="""Dear Student,

Amal Academy — Pakistan's largest career development fellowship, supported
by Stanford University's d.school — invites applications for its 2026
Career-Prep Fellowship cohort.

WHAT IS AMAL FELLOWSHIP?
A 12-week, fully funded remote programme that equips university students
with professional skills that Pakistani universities don't typically teach:
Design thinking, communication, teamwork, leadership, and career strategy.
90,000+ alumni have gone through this programme since 2014.

PROGRAMME DETAILS:
  Duration:   12 weeks (fully remote — cohorts in May and September)
  Schedule:   2–3 hours per week (fits around classes)
  Cost:       Completely free for selected fellows
  Certificate: Amal + Stanford d.school methodology certificate

SKILLS DEVELOPED:
  Professional communication (English, written and spoken)
  Design thinking and problem-solving frameworks
  CV writing, interview prep, and LinkedIn profile optimisation
  Leadership and project management fundamentals
  Networking and building a professional identity

ELIGIBILITY:
  Currently enrolled in any undergraduate or postgraduate programme in Pakistan
  All disciplines welcome — not just CS or engineering
  Commitment to attend all 12 weekly sessions (non-negotiable)
  Basic laptop and stable internet connection required

REQUIRED:
  Simple online application form — no essays, no test scores
  2 short questions about your career goals

DEADLINE: 28 May 2026

Apply:   https://amalacademy.org/fellowship
Email:   hello@amalacademy.org

Amal Academy Fellowship Team, Lahore/Karachi/Islamabad""",
        received_date=_today.isoformat(),
    ),
    RawEmail(
        id="email_real_020",
        subject="NetSol Technologies — Software Engineering Intern | Lahore | Urgent",
        sender="hr@netsol.com",
        body="""Dear Candidate,

NetSol Technologies — a NASDAQ-listed Pakistani software company (32 years
of operations, offices in 6 countries) — urgently needs Software Engineering
Interns for an immediate start in May 2026.

OPEN ROLES:
  .NET / C# Backend Intern
  Python Data Engineering Intern
  React/Angular Frontend Intern
  QA Automation Intern

PROGRAMME DETAILS:
  Duration:  3 months (May–July 2026)
  Location:  Lahore Techno City, Lahore (onsite)
  Stipend:   PKR 25,000–40,000 per month
  Start:     May 5, 2026 (immediate joining required)

ELIGIBILITY:
  Enrolled in BS CS, SE, or IT at an HEC-recognised university
  Minimum Semester 5 completed
  GPA 2.8+ preferred
  Some project experience in the relevant tech stack

SELECTION: Fast-track process due to urgent requirement
  Day 1: Application + CV submission
  Day 2–3: Online technical test (45 min)
  Day 4–5: Interview (in-person or virtual)
  Day 6:   Offer issued

APPLY IMMEDIATELY:
  Email: hr@netsol.com
  Subject: "Intern Application 2026 — [Stack] — [Your Name] — [University]"
  Attach: CV, latest transcript, any GitHub/portfolio link

DEADLINE: 24 April 2026

Human Resources
NetSol Technologies Ltd.
Lahore Techno City, 350-Z, Phase II, LCCHS, Lahore 54792""",
        received_date=_today.isoformat(),
    ),
]
