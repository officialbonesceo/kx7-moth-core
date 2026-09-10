# Required Credentials

Add these in GitHub → Settings → Secrets and variables → Actions

## Required now (Blog / pulse-a)

| Secret name | Where to get it | Required |
|-------------|-----------------|----------|
| `OPENROUTER_API_KEY` | https://openrouter.ai/keys | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar | Yes |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens (D1 + Pages edit) | Yes |
| `CF_D1_DATABASE_ID` | Cloudflare → Workers → D1 → your DB | Yes |
| `CF_PAGES_PROJECT` | Cloudflare Pages project name | Yes |

## Optional later (Video / pulse-b)
| Secret | Purpose |
|--------|--------|
| `ELEVENLABS_API_KEY` | Better AI voice |
| `YOUTUBE_CLIENT_ID` | Auto upload |
| `YOUTUBE_CLIENT_SECRET` | Auto upload |
| `YOUTUBE_REFRESH_TOKEN` | Auto upload |

## Cloudflare token permissions needed
- Account → D1: Edit
- Account → Cloudflare Pages: Edit
- Account → Workers Scripts: Edit (if using workers)
