# Environment Setup

## What You Need

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` - PostgreSQL connection string (I use Neon's free tier)
- `GEMINI_API_KEY` - Get this from Google AI Studio (ai.google.dev)

**Don't commit your `.env` file!** It's already in `.gitignore` so you should be good.

## Quick Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

Where to get credentials:
- **Database**: [Neon](https://neon.tech) (free PostgreSQL, super easy setup)
- **Gemini API**: [Google AI Studio](https://ai.google.dev/) (free tier is generous)

## What's Ignored

The `.gitignore` already handles this, but for reference:
- `.env*` files (except `.env.example`)
- `node_modules/`
- `.next/`
- Build artifacts

## Before Pushing to GitHub

Just run `git status` and make sure your `.env` isn't in there. The `.gitignore` should catch it automatically.

## If You Mess Up

Accidentally committed your `.env`? Here's what I'd do:

1. Delete/regenerate the API key immediately (Google AI Studio → delete old key)
2. Rotate database password
3. Remove from git history:
   ```bash
   git rm --cached .env
   git commit --amend
   ```

Better to just not commit it in the first place though. The `.gitignore` should prevent this.

## Tips

- Use different API keys for dev and production
- Keep an eye on your Gemini API usage (free tier has limits)
- Neon's free tier is great for dev, but you might want to upgrade for production

