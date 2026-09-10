# Cloudflare Pages Setup

## Why the build failed
Pages was building from the **repo root**, but the website is inside the `site/` folder.

## Fix in Cloudflare Pages

Open your Pages project → **Settings → Builds & deployments** (or Build configuration):

| Setting | Value |
|--------|--------|
| **Root directory** | `site` |
| **Build command** | `npm run build` |
| **Deploy command** | (leave default) |
| **Node version** | `20` or `22` |

Then click **Save** and **Retry deployment**.

## D1 Binding
Settings → Bindings:

| Type | Variable name | Database |
|------|---------------|----------|
| D1 | `DB` | `lanecash-db` |

## Note
GitHub Actions (`pulse-a`) still runs from the **repo root**. That is correct.
Only Pages must use root directory `site`.
