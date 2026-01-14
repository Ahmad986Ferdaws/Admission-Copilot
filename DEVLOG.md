# Development Log

Just keeping track of what I'm working on and what's left to do.

## Week 1 - Dec 1-3

Started the project! Got the basic Next.js setup working with the app router. Spent way too long figuring out Tailwind v4 config lol.

- [x] Set up Next.js 14 with TypeScript
- [x] Configure Tailwind CSS v4
- [x] Set up Prisma with PostgreSQL (using Neon for free tier)
- [x] Create basic database schema

## Week 2 - Dec 3-5

Working on the core features. The matching algorithm took longer than expected - had to tweak the weights a bunch to get reasonable results.

- [x] Build student profile form (4-step wizard)
- [x] Implement program matching algorithm
- [x] Integrate Gemini AI for program explanations
- [x] Create program listing and detail pages
- [x] Add task management system

### Notes to self:
- The GPA conversion between different scales is still a bit rough, might need to revisit
- Need to add proper authentication later (using mock user for now)
- Task auto-generation works but deadlines could be smarter

## Challenges

**Prisma Migrations**: Had some weird issues with Prisma migrations on Neon. Turns out you need the `?sslmode=require` in the connection string. Wasted an hour on that 🤦

**Gemini API**: Initially tried gemini-1.5-pro but hit rate limits. Switched to gemini-2.5-flash and it's much faster + cheaper. Good enough for this project.

**State Management**: Debated using Zustand but decided to keep it simple with React Server Components and server actions. Less complexity = better for now.

## What's Working

- Matching algorithm gives decent results
- AI explanations are actually pretty helpful
- The UI looks clean (thanks Tailwind)
- Seed data covers enough scenarios for testing

## Known Issues / TODO

- [ ] Authentication is mocked (need to add NextAuth or Clerk)
- [ ] No email sending yet (templates are generated but not sent)
- [ ] Could use better error handling in some places
- [ ] Mobile responsiveness needs work on some pages
- [ ] No tests yet (should probably add some)

## Future Ideas

If I have time:
- Add document upload feature
- Track application status (submitted, accepted, rejected)
- Add calendar view for deadlines
- Maybe a chat interface for the AI copilot?
- Scholarship database integration

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS v4
- Google Gemini AI
- Lucide React (icons)

---

Last updated: Dec 5, 2024

