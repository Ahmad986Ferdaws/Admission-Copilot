# 🎓 Admission Copilot

An AI-powered university program discovery and application management platform built with Next.js 14, Prisma, PostgreSQL, and Google Gemini AI.

## ✨ Features

- **Smart Program Matching**: Algorithm-based matching that considers GPA, test scores, budget, location, and major interests
- **AI-Powered Insights**: Get personalized program explanations and fit analysis using Google Gemini
- **Task Management**: Auto-generate and track application tasks with deadlines
- **Document Checklists**: AI-generated lists of required documents per program
- **Multi-tier Categorization**: Programs categorized as SAFE, MATCH, or REACH based on your profile

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **AI**: Google Gemini API

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, Supabase, or local)
- Google Gemini API key

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd admission-copilot-app
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
```

### 3. Set Up Database

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database with sample programs:

```bash
npm run db:seed
```

This will create:
- 16 universities across USA, Canada, UK, Germany, and Australia
- 20+ programs in Computer Science, Data Science, and Software Engineering
- A mock user account

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📖 Usage Guide

### Step 1: Complete Your Profile

1. Navigate to `/profile` or click "Get Started" from the landing page
2. Fill out the 4-step profile form:
   - **Step 1**: Geographic information (citizenship, residence, target countries)
   - **Step 2**: Academic details (degree level, major, GPA)
   - **Step 3**: Test scores and budget
   - **Step 4**: Timeline (intake term and year)
3. Click "Find Programs" to run the matching algorithm

### Step 2: Browse Matched Programs

- View your dashboard at `/dashboard` to see match statistics
- Visit `/programs` to see all matched programs
- Programs are categorized as:
  - **🟢 SAFE**: High fit score (70%+), exceeds requirements
  - **🟡 MATCH**: Good fit score (50-70%), meets requirements
  - **🔴 REACH**: Challenging (< 50%), requirements are ambitious

### Step 3: Explore Program Details

Click on any program to see:
- **AI Explanation**: Why this program is a good fit for you (powered by Gemini)
- **Requirements**: GPA and English score requirements
- **Document Checklist**: AI-generated list of required documents
- **Generate Tasks**: Auto-create application tasks

### Step 4: Manage Tasks

- Visit `/tasks` to see all your application tasks
- Click checkboxes to mark tasks as complete
- Tasks are organized by status: TODO, In Progress, Completed

## 🤖 AI Features

### 1. Program Explanations

Uses Gemini to analyze:
- How your profile aligns with requirements
- Budget compatibility
- Academic fit
- Strengths and areas of concern

### 2. Document Checklists

Generates program-specific document lists based on:
- Degree level (Bachelors/Masters/PhD)
- Country requirements
- Field of study

### 3. Task Generation

Auto-creates standard tasks:
- Write Statement of Purpose
- Request Recommendation Letters
- Prepare Financial Documents
- Complete Application Form
- Submit Transcripts

All with calculated deadlines relative to application due dates.

## 📂 Project Structure

```
admission-copilot-app/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── dashboard/                # Main dashboard
│   ├── profile/                  # Multi-step profile form
│   ├── programs/                 # Programs list & detail
│   ├── tasks/                    # Task management
│   ├── actions/                  # Server actions
│   └── api/                      # API routes
├── lib/
│   ├── llm/gemini.ts            # Gemini AI integration
│   ├── matching/algorithm.ts    # Matching algorithm
│   └── db.ts                    # Prisma client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
└── components/                  # React components
```

## 🔐 Authentication Note

**v1 uses a mock user** for simplicity. In production, integrate:
- NextAuth.js for authentication
- Session management
- User-specific data access

Current mock user: `john.doe@example.com`

## 🧪 Testing

Test the Gemini API integration:

```bash
# Visit in browser
http://localhost:3000/api/test-gemini
```

Expected response: JSON with AI-generated program explanation.

## 🎯 Matching Algorithm

The algorithm considers:

1. **Eligibility Filtering**:
   - Degree level match
   - GPA meets minimum
   - English score meets minimum
   - Deadline not passed

2. **Fit Scoring** (0-100):
   - Budget compatibility (30%)
   - Country/region match (25%)
   - Major alignment (25%)
   - Academic profile fit (20%)

3. **Tier Assignment**:
   - **SAFE**: 70%+ fit, significantly exceeds requirements
   - **MATCH**: 50-70% fit, meets requirements solidly
   - **REACH**: < 50% fit, requirements are challenging

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure to set environment variables in Vercel dashboard.

### Other Platforms

Works with any platform supporting Next.js 14:
- Railway
- Render
- AWS Amplify
- Netlify

## 📝 Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🔧 Troubleshooting

### "GEMINI_API_KEY is not set"


Restart dev server after changing `.env`.

### "No matches found"

Ensure:
1. Database is seeded: `npm run db:seed`
2. Profile form is completed with valid data
3. Target countries match programs in database

### Database connection errors

Check `DATABASE_URL` format:
```
postgresql://username:password@host:5432/database?sslmode=require
```

## 📄 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

This is v1 with mock authentication. Future improvements:
- Real authentication system
- Email template generation
- Chat interface for AI copilot
- Document upload and tracking
- Application status tracking
- Scholarship search integration

---

Built with ❤️ using Next.js, Prisma, and Google Gemini AI
