# product.md — AI-Assisted FAQ & Query Resolution System

---

## 1. Problem Statement

### What Problem Are We Solving?

In most organizations, interns and new employees repeatedly ask the same questions. Senior staff or admins waste time answering the same query over and over. There is no structured way to capture, reuse, or grow that knowledge.

**Core pain points:**
- People ask the same question multiple times and no one captures the answer permanently
- Admins are overwhelmed by repetitive, individual questions
- Knowledge built up over time gets lost or buried in chat logs and emails
- Traditional keyword-based search misses the intent behind a question

### Objective

Build an AI-powered knowledge management system where:
1. Users ask questions and get instant answers from a living knowledge base
2. Unanswered questions are saved and presented to the community for discussion
3. Admins moderate, publish official FAQs, and manage the knowledge base
4. Future users benefit from every answer ever published
5. Interns can collaborate on unresolved queries without blocking the admin workflow

---

## 2. Target Users

### Super Admin
- Full platform control
- Manage admin and intern roles
- Access audit logs and FAQ manager
- All admin capabilities

### Admin
- Review and resolve unresolved queries
- Publish official answers as FAQs
- Manage and moderate the FAQ database
- Moderate the Discussion Room (accept/delete answers, ban users)
- Monitor system health and usage via analytics dashboard

### Intern / User
- Simple chatbot interface to ask questions
- Instant AI-generated answers from the FAQ knowledge base
- Hybrid semantic + keyword search across FAQs
- Ability to participate in Discussion Room threads
- Earn points for contributions; appear on the Leaderboard

---

## 3. Core Workflow

```
User asks query
        ↓
AI checks FAQ database using hybrid search (semantic + keyword)
        ↓
Answer Found?
 ┌──────────────────────────┐
 │ Yes                      │ No
 ↓                          ↓
Return AI-generated    Store as unresolved query
response                     ↓
                   Duplicate prevention check
                             ↓
                   Saved to Discussion Room
                             ↓
                   Community discusses + suggests answers
                             ↓
                   Admin moderates → publishes FAQ
                             ↓
                   New FAQ embedding auto-generated
                             ↓
                   Future users get instant answers
```

---

## 4. Tech Stack

### Frontend
- **React.js** — Chatbot interface, Discussion Room, Admin Dashboard, Leaderboard
- **CSS Variables / Custom Design System** — Consistent theming, animations

### Backend
- **Node.js + Express.js** — REST API, route handling, middleware

### Databases
- **MongoDB Atlas** — Users, FAQs, queries, discussions, answers, points
- **In-memory embedding cache** — Fast semantic search without ChromaDB overhead

### AI / ML
- **Gemini Embeddings** — Converts text into vector representations for semantic search
- **Groq LLM** — Generates contextual AI answers from retrieved FAQ context

### Real-time
- **Socket.IO** — Real-time notifications for answers, upvotes, and admin actions

### Auth
- **JWT (Access + Refresh tokens)** — Secure session management
- **Google OAuth** — One-click sign-in via Google

---

## 5. Implemented Features

### Authentication
- Role-based auth: `intern`, `admin`, `super_admin`
- JWT access + refresh token flow
- Google OAuth sign-in
- Protected routes per role

### FAQ Hub (Knowledge Base)
- All published FAQs browsable by category
- 14 categories: about-internship, certificate, code-of-conduct, coursework-vibe, interviews, noc, rosetta, selection-offer, team-formation, timing-dates, vibe-platform, work-mentorship, yaksha-chat, programme-overview
- Programme Overview section (scraped from live source with fallback)
- Trending FAQs section (top 4 shown by default)
- Category filter buttons
- Expandable FAQ accordions

### Hybrid Search
- Semantic search using Gemini embeddings
- Keyword search fallback
- Combined hybrid scoring for best results
- Search suggestions / autocomplete
- Debounced input for performance

### AI Chatbot (FaqAssistant)
- Floating assistant button on FAQ Hub
- Answers questions using retrieved FAQ context via Groq LLM
- Falls back gracefully when no FAQ match found

### Unresolved Query System
- Queries with no FAQ match are saved to MongoDB
- Semantic duplicate check before saving — merges if similar entry exists
- Saved queries appear in Discussion Room

### Discussion Room
- Reddit-style expandable threads
- Sort by: New, Top, Trending
- Search within discussions
- Inline upvote/downvote on answers
- Post answers to open questions
- Points awarded on contribution

### Points & Leaderboard
- +10 for posting an answer
- +5 for receiving an upvote on an answer
- -2 for receiving a downvote
- +20 for answer being accepted by admin
- Leaderboard page showing top contributors

### Real-time Notifications
- Socket.IO powered
- Notifications for: new answers on your question, upvotes received, admin actions

### Admin Dashboard
- View and manage all users
- Role management (promote intern → admin, demote, etc.)
- Moderation panel: Accept, Delete, Ban on Discussion Room answers
- Analytics dashboard: total users, questions, answers, FAQs
- FAQ publishing (manual entry)

### Super Admin Panel
- FAQ Manager tab
- Audit Log tab
- Full role management including assigning admin roles
- All admin capabilities

### Navigation (Role-based Sidebar)
- **Intern:** FAQ Hub, Dashboard, Ask Question, My Questions, Discussion Room, Leaderboard
- **Admin / Super Admin:** FAQ Hub, Dashboard, Discussion Room, Leaderboard, Admin Area

---

## 6. Database Design

### MongoDB Collections

| Collection | Stores |
|------------|--------|
| `users` | User accounts, roles, points, auth tokens |
| `faqs` | Published FAQs with question, answer, category, timestamps |
| `queries` | Unresolved user queries |
| `questions` | Discussion Room questions with status |
| `answers` | Answers to Discussion Room questions with votes |
| `notifications` | Real-time notification records per user |

---

## 7. Project Structure

```
project-root/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── searchApi.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── FaqAssistant.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchSuggestions.jsx
│   │   │   ├── GoogleSignInButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── UserPage.jsx        (FAQ Hub)
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   ├── MyQuestions.jsx
│   │   │   ├── QuestionDetail.jsx
│   │   │   ├── AnswerCenter.jsx    (Discussion Room)
│   │   │   ├── AdminArea.jsx
│   │   │   ├── QueryPage.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── faqService.js
│   │   │   ├── questionService.js
│   │   │   ├── answerService.js
│   │   │   └── adminService.js
│   │   └── styles/
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── faqController.js
│   │   ├── queryController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Faq.js
│   │   ├── Query.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── faqRoutes.js
│   │   ├── queryRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── answerRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── searchRoutes.js
│   │   └── internshipRoutes.js
│   ├── services/
│   │   ├── searchService.js
│   │   ├── embeddingService.js
│   │   ├── scraper.js
│   │   └── internshipFaqs.js
│   └── server.js
│
├── docs/
│   ├── product.md
│   └── README.md
│
└── .env
```

---

## 8. Feature Checklist

| Feature | Status |
|---------|--------|
| Role-based authentication (intern/admin/super_admin) | ✅ Built |
| JWT access + refresh token flow | ✅ Built |
| Google OAuth sign-in | ✅ Built |
| FAQ Hub with category filtering | ✅ Built |
| Programme Overview section | ✅ Built |
| Hybrid search (semantic + keyword) | ✅ Built |
| Search suggestions / autocomplete | ✅ Built |
| AI chatbot (FaqAssistant) | ✅ Built |
| Unresolved query saving | ✅ Built |
| Semantic duplicate prevention | ✅ Built |
| Discussion Room with threads | ✅ Built |
| Upvote / downvote on answers | ✅ Built |
| Points system | ✅ Built |
| Leaderboard | ✅ Built |
| Real-time notifications (Socket.IO) | ✅ Built |
| Admin moderation panel | ✅ Built |
| Analytics dashboard | ✅ Built |
| Super admin panel (FAQ Manager + Audit Log) | ✅ Built |
| Role-based sidebar navigation | ✅ Built |
| MongoDB Atlas | ✅ Connected |
| Document upload + FAQ extraction | 🔲 Not built |
| Query clustering | 🔲 Removed from scope |
| n8n automation workflows | 🔲 Removed from scope |

---

## 9. Future Enhancements

- Document upload via admin dashboard (PDF/TXT/DOCX → auto FAQ extraction)
- RAG pipeline for uploaded documents directly from the admin dashboard 
- Multi-language semantic search
- Voice-based queries (speech-to-text)
- AI-generated FAQ suggestions for admin approval
- Real-time co-editing on FAQ drafts
- Mobile app (React Native)
- 