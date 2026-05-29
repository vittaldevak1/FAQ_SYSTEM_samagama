const INTERNSHIP_FAQS = [
  // About the internship
  {
    category: 'internship',
    order: 1,
    question: 'What is the Vicharanashala internship?',
    answer: 'A two-month, full-time engagement at the Vicharanashala Lab, a research lab at IIT Ropar. You will work on a real open-source project under a mentor, after a short training phase tailored to where you already are. The internship is free — we do not charge, and the work is real.',
    tags: ['vicharanashala', 'internship', 'overview', 'iit ropar', 'research lab'],
  },
  {
    category: 'internship',
    order: 2,
    question: 'What is VINS?',
    answer: 'VINS is the Vicharanashala Internship — an online programme open to anyone who clears our interview. The work is real open-source contribution under a mentor, the certificate is from the Vicharanashala Lab for Education Design at IIT Ropar, and the programme itself is free (we charge nothing). There is no stipend. If you are seeing a yellow VINS panel on your result page, you are selected.',
    tags: ['vins', 'online', 'internship', 'vicharanashala', 'iit ropar'],
  },
  {
    category: 'internship',
    order: 3,
    question: 'What are the phases of VINS and what do the badges mean?',
    answer: 'VINS is structured as four phases: Bronze (Phase 1) — a short training period at the start; Silver (Phase 2) — the main work contributing to a real open-source project; Gold (Phase 3) — a recognition awarded during Silver if your contribution stands on its own as a meaningful feature; Platinum (Phase 4) — a standing invitation to visit the lab. Most interns finish at Bronze + Silver, and that is exactly what the certificate is for.',
    tags: ['phases', 'badges', 'bronze', 'silver', 'gold', 'platinum', 'progression'],
  },
  {
    category: 'internship',
    order: 4,
    question: 'Who is the internship for? Are alumni eligible?',
    answer: 'The internship is for currently-enrolled students at any college or university — undergraduate, postgraduate, or doctoral. The NOC requirement is the practical reflection of this. Candidates who have already graduated and are not currently enrolled in any programme are not eligible for this cycle. If you re-enrol later (higher studies, etc.), you are welcome to apply again in a future cycle.',
    tags: ['eligibility', 'alumni', 'students', 'enrolled', 'noc'],
  },
  {
    category: 'internship',
    order: 5,
    question: 'Is this the same as IIT Ropar official Summer Research Internship?',
    answer: 'No. Summership 2026 is a VLED Lab initiative. The certificate is issued by the Vicharanashala Lab for Education Design, not centrally by the institute. IIT Ropar runs a separate institutional summer research internship through its own office. Do not represent Summership 2026 as equivalent to that programme.',
    tags: ['iit ropar', 'summer research', 'official', 'difference', 'certificate'],
  },

  // Timing and dates
  {
    category: 'internship',
    order: 6,
    question: 'When can I start the internship?',
    answer: 'You can start any time in 2026 — VINS is flexible on the start date. Your internship must finish by 31 December 2026. Whatever start you pick, your end date (start + 2 months, with up to 1 month grace) must land on or before 31 December 2026. The strong recommendation is to start as soon as possible to catch the May–July main cohort for networking, TA support, and training.',
    tags: ['start date', 'flexible', 'deadline', 'december', 'cohort'],
  },
  {
    category: 'internship',
    order: 7,
    question: 'How long is the internship?',
    answer: 'Two months from your chosen start date, with an optional one-month grace period if you need it. End must land on or before 31 December 2026.',
    tags: ['duration', 'two months', 'grace period', 'timeline'],
  },
  {
    category: 'internship',
    order: 8,
    question: 'Can I start in July or August if I have exams now?',
    answer: 'Yes — but only if your exams genuinely make an earlier start impossible. Wait until your exams are done, then opt in and start. Do not attempt to juggle this internship with ongoing exams. Make sure your chosen start date plus 2 months (or 3 with grace) lands on or before 31 December 2026.',
    tags: ['late start', 'exams', 'defer', 'postpone'],
  },
  {
    category: 'internship',
    order: 9,
    question: 'Can I start with the cohort and take relaxation during my exam window?',
    answer: 'No. VINS is a full-attention internship — six to ten hours a day. Splitting that with college exams damages both sides. If your exams fall inside the cohort duration, defer your start to after your exams end. If we later learn that a candidate was sitting college exams during their internship period, we reserve the right to terminate the internship or withhold the certificate.',
    tags: ['exams', 'relaxation', 'full attention', 'policy', 'termination'],
  },

  // NOC
  {
    category: 'internship',
    order: 10,
    question: 'What dates do I put on the NOC?',
    answer: 'Default: your chosen start date to start date + 2 months (with up to 1 month grace), ensuring the end date is on or before 31 December 2026. Pick the earliest start date you can realistically make. If the NOC will be signed on a specific later date, pick a start date after the signature date.',
    tags: ['noc', 'dates', 'start date', 'end date', 'signature'],
  },
  {
    category: 'internship',
    order: 11,
    question: 'Who can sign the NOC?',
    answer: 'Any authorised signatory at your college: HOD, Acting HOD (during holidays), Principal, Dean, Director, or Training & Placement Officer. For dual-degree students, either institution can sign. For IITM BS Online Degree students, any officer from the BS office can sign.',
    tags: ['noc', 'signatory', 'hod', 'principal', 'dean', 'authorised'],
  },
  {
    category: 'internship',
    order: 12,
    question: 'When do I submit the NOC? Is there a deadline?',
    answer: 'There is no specific calendar cut-off date — but your internship cannot formally begin until your official institutional NOC has been uploaded and validated by us. A self-declaration gets you a provisional offer letter immediately, but it does not start the internship. Submit your signed NOC as early as possible.',
    tags: ['noc', 'deadline', 'submit', 'upload', 'self-declaration'],
  },
  {
    category: 'internship',
    order: 13,
    question: 'What format should the NOC be in?',
    answer: 'We provide a printable NOC format. Once your result is out and you log in to samagama.in, you will see a "Download blank NOC" button on your dashboard. Take a printout, get it physically signed and stamped by your authorised signatory, scan it, and upload the signed PDF. You do not need to draft anything yourself.',
    tags: ['noc', 'format', 'download', 'printable', 'upload'],
  },
  {
    category: 'internship',
    order: 14,
    question: 'Can my college give me an NOC in their own format?',
    answer: 'Yes, as long as all required entries are present: the signing authority\'s handwritten signature (most important), their name/designation/official email/phone number, your full name and the internship period, and your signature. If your college\'s format does not include a place for your signature, sign clearly anywhere on the document before uploading.',
    tags: ['noc', 'college format', 'signature', 'required fields'],
  },
  {
    category: 'internship',
    order: 15,
    question: 'Does the NOC need to be signed by hand?',
    answer: 'Yes. Three things are required: the authorised signatory\'s handwritten signature, the institutional rubber stamp/seal applied in the designated area, and the signatory\'s email address filled in the designated field. Digital signatures are not accepted on the PDF path.',
    tags: ['noc', 'handwritten', 'signature', 'rubber stamp', 'digital signature'],
  },
  {
    category: 'internship',
    order: 16,
    question: 'How do I download and upload the NOC?',
    answer: 'Both happen on your dashboard at samagama.in. You will see a NOC section with two buttons: "Download blank NOC" saves the printable NOC format PDF, and "Upload signed NOC (PDF)" opens a file picker. The file must be a PDF of at most 1 MB. Confirmation appears once the upload is received.',
    tags: ['noc', 'download', 'upload', 'dashboard', 'pdf'],
  },

  // Selection, offer letter, certificate
  {
    category: 'internship',
    order: 17,
    question: 'How do I know I am selected?',
    answer: 'If you can see your yellow VINS result panel on samagama.in, you are selected. There is no separate selection step or confirmation email.',
    tags: ['selection', 'result', 'vins', 'yellow panel', 'dashboard'],
  },
  {
    category: 'internship',
    order: 18,
    question: 'How do I opt into VINS?',
    answer: 'Tell Yaksha in the chat: "I want to take up the online internship without stipend." Yaksha will confirm. Opting in is the selection — no separate confirmation email is sent at that stage.',
    tags: ['opt in', 'vins', 'yaksha', 'chat', 'selection'],
  },
  {
    category: 'internship',
    order: 19,
    question: 'When do I get the offer letter?',
    answer: 'Your offer letter is issued automatically. If you upload a self-declaration, a provisional offer letter is issued immediately. If you upload your signed NOC first (and confirm your dates), your offer letter is issued automatically once the NOC is validated. The offer letter lives on your dashboard at samagama.in, not in your email.',
    tags: ['offer letter', 'provisional', 'self-declaration', 'noc', 'dashboard'],
  },
  {
    category: 'internship',
    order: 20,
    question: 'Will I get a certificate?',
    answer: 'Yes — every intern who completes the internship gets a certificate from Vicharanashala, IIT Ropar. The internship is genuinely demanding; candidates who drop out mid-way do not get a certificate. Finishing means something, because the bar is high.',
    tags: ['certificate', 'completion', 'iit ropar', 'vicharanashala'],
  },
  {
    category: 'internship',
    order: 21,
    question: 'How do I confirm my internship dates?',
    answer: 'Once you have opted into VINS in the chat with Yaksha, log in to samagama.in. On the dashboard, you will see a yellow card titled "Confirm your internship dates". The date pickers pre-fill with sensible defaults. If those work, hit "Save dates". Otherwise edit them to your earliest realistic start. Your end must be on or before 31 December 2026.',
    tags: ['dates', 'confirm', 'dashboard', 'start date', 'end date'],
  },
  {
    category: 'internship',
    order: 22,
    question: 'How do I accept the offer letter?',
    answer: 'Reply All on the offer-letter email thread. Paste the following acceptance statement exactly: "I, [Full Name], confirm that I have read, understood, and accepted all terms, conditions, and obligations set out in this offer letter and in the program FAQ at samagama.in. I formally accept the offer of Summer Internship 2026." Do not paraphrase. The reply must reach us within 5 days of the offer letter being sent.',
    tags: ['offer letter', 'accept', 'reply', 'format', 'deadline'],
  },
  {
    category: 'internship',
    order: 23,
    question: 'What if I reply without using the exact acceptance format?',
    answer: 'The offer is withdrawn, effective immediately, with no further correspondence. The withdrawal is final. This is a deliberate policy — the acceptance statement is the first attention-to-detail check. Non-compliant replies include paraphrasing, sending only "I accept", missing the date, or missing the FAQ-reference clause. There is an appeal path by emailing sudarshansudarshan@gmail.com with subject "Request to Reconsider: Confirmation Reply Error".',
    tags: ['offer letter', 'accept', 'withdrawal', 'appeal', 'attention to detail'],
  },

  // Work, mentorship, projects
  {
    category: 'internship',
    order: 24,
    question: 'What will I work on during the internship?',
    answer: 'A real open-source project from Vicharanashala\'s portfolio — assigned based on your background and the lab\'s current needs. Areas range across AI/ML, web development, NLP, computer vision, agriculture-tech (Annam.AI), education-tech (ViBe), and open-source infrastructure. We do not pre-publish the exact problem.',
    tags: ['work', 'project', 'open-source', 'ai', 'ml', 'assignment'],
  },
  {
    category: 'internship',
    order: 25,
    question: 'How many hours per day are expected?',
    answer: 'Plan for 6 to 10 hours a day, sometimes more during the build phase. This is a full-time internship for the two-month window. Most candidates who drop out are juggling something else — VINS expects your full attention.',
    tags: ['hours', 'time commitment', 'full-time', 'dedication'],
  },
  {
    category: 'internship',
    order: 26,
    question: 'Who is my mentor?',
    answer: 'You will work with the lab\'s research and engineering team. The exact mentor depends on the project. The model is fluid — you will get help from a senior researcher one day, a peer the next, and someone else for a different question. That is how real open-source work happens.',
    tags: ['mentor', 'research team', 'guidance', 'support'],
  },
  {
    category: 'internship',
    order: 27,
    question: 'Is there a stipend?',
    answer: 'No. The internship is unpaid. Stellar performers may be recognised with a discretionary stipend at the lab\'s option, but this is not promised or expected.',
    tags: ['stipend', 'payment', 'unpaid', 'compensation'],
  },
  {
    category: 'internship',
    order: 28,
    question: 'Do I need my own laptop? What software should I install?',
    answer: 'Yes — a personal laptop is required. We prefer Linux or macOS. If you use Windows, please install a terminal that can SSH and run Unix-style commands — for example, Windows Subsystem for Linux (WSL) is a clean choice. Your mentor will guide you on specific tools needed once your project is assigned.',
    tags: ['laptop', 'software', 'linux', 'macos', 'wsl', 'tools'],
  },

  // Code of conduct
  {
    category: 'internship',
    order: 29,
    question: 'What are the official communication channels?',
    answer: 'Official channels only: Announcements section on samagama.in (all programme notifications, check regularly during working hours), Yaksha chat on samagama.in (primary channel for any question, use #escalate to reach a human), Discussion forum for peer collaboration, and Email to sudarshansudarshan@gmail.com as a last resort. WhatsApp support is cancelled. Unofficial groups (WhatsApp, Telegram, Discord) are strictly prohibited.',
    tags: ['communication', 'channels', 'yaksha', 'announcements', 'discord', 'whatsapp'],
  },

  // Rosetta journal
  {
    category: 'internship',
    order: 30,
    question: 'What is Rosetta?',
    answer: 'Rosetta is your internship journal — a 65-day document, one entry per day, for the full duration of Summership 2026. You write in it daily, keep it privately, and submit it at the end of the internship as one of your completion requirements. The name comes from the Rosetta Stone.',
    tags: ['rosetta', 'journal', 'daily', 'reflection', 'submission'],
  },
  {
    category: 'internship',
    order: 31,
    question: 'Why does Rosetta exist? Is it just busywork?',
    answer: 'No. It exists for two reasons. For you: Most people go through an intense experience without processing it. The journal builds articulation, one day at a time. For us: When you submit Rosetta at the end, it gives us qualitative insight into your experience that no survey can capture.',
    tags: ['rosetta', 'purpose', 'reflection', 'feedback', 'learning'],
  },
  {
    category: 'internship',
    order: 32,
    question: 'Can I use ChatGPT or AI tools to write Rosetta entries?',
    answer: 'No. This is the one firm rule of Rosetta. The journal is a record of your thinking, not a demonstration of what an AI can produce. Entries that read as AI-generated will not be counted toward your completion requirement. If your entire journal reads this way, the journal will not be accepted.',
    tags: ['rosetta', 'ai', 'chatgpt', 'plagiarism', 'policy'],
  },

  // ViBe Platform
  {
    category: 'internship',
    order: 33,
    question: 'How do I log in to ViBe?',
    answer: 'Log in to ViBe via app.vibeclassroom.com using your registered email. After logging in, go to "My Courses" to see enrolled courses. If you see "No course enrolled", contact support with your name and email.',
    tags: ['vibe', 'login', 'courses', 'platform', 'access'],
  },
  {
    category: 'internship',
    order: 34,
    question: 'Why are videos stuck or repeating on ViBe?',
    answer: 'This usually happens when the platform detects that your attention may have shifted — e.g., you looked away, opened another tab, or stepped away. Unlike standard video players, ViBe is designed to ensure active engagement and may pause or replay sections to confirm you are following along. Focus on the video without multitasking. If the issue persists, check your internet stability and camera positioning.',
    tags: ['vibe', 'video', 'stuck', 'repeating', 'attention', 'engagement'],
  },
  {
    category: 'internship',
    order: 35,
    question: 'What are penalty scores on ViBe and how do they affect performance?',
    answer: 'Penalty scores are assigned when the system detects disengagement — like looking away, walking away, or attempting to skip content. These scores are tracked against your overall engagement metrics. High penalty scores can affect your progress and may result in being moved to the next batch if thresholds are crossed. Maintain consistent focus to avoid penalties.',
    tags: ['vibe', 'penalty', 'scores', 'engagement', 'disengagement'],
  },
  {
    category: 'internship',
    order: 36,
    question: 'What is Linear Progression on ViBe?',
    answer: 'Linear Progression means you must complete lessons and quizzes in the predetermined order. You cannot skip ahead or jump to later sections. This ensures foundational knowledge is built before moving to advanced topics. Follow the sequence shown in your course outline.',
    tags: ['vibe', 'linear progression', 'order', 'sequence', 'lessons'],
  },

  // Team Formation
  {
    category: 'internship',
    order: 37,
    question: 'Is team formation compulsory?',
    answer: 'Yes, team formation is compulsory for the internship. You will be assigned to a team during Phase 1. Teams are essential for collaborative learning and project work in later phases.',
    tags: ['team', 'formation', 'compulsory', 'collaboration'],
  },
  {
    category: 'internship',
    order: 38,
    question: 'What is the size of a team?',
    answer: 'Teams typically consist of 3-4 members. The exact size may vary based on the cohort and project requirements.',
    tags: ['team', 'size', 'members'],
  },
  {
    category: 'internship',
    order: 39,
    question: 'How are teams formed?',
    answer: 'Teams are formed during a structured activity in Phase 1. You will have an opportunity to express preferences, and the final teams are assigned considering complementary skills and backgrounds.',
    tags: ['team', 'formation', 'assignment', 'preferences'],
  },

  // Certificate
  {
    category: 'internship',
    order: 40,
    question: 'Does the certificate specify whether it was completed online or offline?',
    answer: 'The certificate you receive is the same for both tracks (VINS online and VISE offline). It is issued by Vicharanashala, IIT Ropar, and does not specify whether you completed it online or on campus. The mode is not called out separately on the document.',
    tags: ['certificate', 'online', 'offline', 'mode', 'vins', 'vise'],
  },
  {
    category: 'internship',
    order: 41,
    question: 'Will the completion certificate be a physical hardcopy or an e-certificate?',
    answer: 'The completion certificate is issued as an e-certificate — you download it from your dashboard on samagama.in after completing both Bronze and Silver. We do not print and mail physical copies. The certificate is digitally signed and can be verified from our database using the number on the certificate.',
    tags: ['certificate', 'e-certificate', 'digital', 'download', 'verification'],
  },

  // Overview content
  {
    category: 'internship',
    order: 42,
    question: 'What is the overview of the Vicharanashala internship programme?',
    answer: 'The Vicharanashala internship is a two-month, full-attention engagement at the lab of Prof. Sudarshan Iyengar at IIT Ropar. We work on real, open-source software for India-centric problems — agriculture (Annam.AI), education (ViBe), and other research-driven projects. Selected candidates see a yellow VINS result panel on samagama.in. The programme includes online (VINS) and offline (VISE) tracks.',
    tags: ['overview', 'programme', 'iit ropar', 'open-source', 'research'],
  },
  {
    category: 'internship',
    order: 43,
    question: 'What are the attendance and participation requirements?',
    answer: 'Attendance and participation are tracked strictly. Over a rolling window of the last five working days, you must attend at least 85% of live Zoom session time, respond to at least 85% of in-session polls and quizzes, and attempt every quiz with a pass mark of at least 50%. If any falls below the bar, you are excused from the current batch and moved to the next one.',
    tags: ['attendance', 'participation', 'zoom', 'quizzes', 'requirements', 'standards'],
  },
  {
    category: 'internship',
    order: 44,
    question: 'Why is the interview on samagama.in?',
    answer: 'Every candidate goes through a structured AI-led interview at samagama.in with our interviewer agent, Yaksha. This gives every applicant — irrespective of college brand, network, or geography — the same calibrated conversation about their work. Prof. Iyengar reads every transcript personally. The interview is the only formal assessment in this cycle.',
    tags: ['interview', 'yaksha', 'ai', 'assessment', 'samagama'],
  },
  {
    category: 'internship',
    order: 45,
    question: 'What do I do after selection?',
    answer: 'Go to samagama.in and sign in. Read your result panel carefully. Tell Yaksha you want to opt in to VINS in the exact phrase shown on the panel. Download the NOC, get it signed and stamped, and upload it back via the Upload NOC button. Wait for your offer letter and show up on your start date with full attention.',
    tags: ['selection', 'next steps', 'opt in', 'noc', 'offer letter', 'start'],
  },
];

module.exports = { INTERNSHIP_FAQS };
