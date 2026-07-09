# Deploy createcv to Cloudflare Pages

The whole app runs on Cloudflare: the React frontend is served as static assets,
and the `/api/*` routes run as **Pages Functions** (in `functions/api/`). The
local Express server (`server/`) is only for `npm run dev` on your machine.

## Option 1 — Git integration (recommended)

1. Push this repo to GitHub (already done: `ucantseemyname/createcv`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick `createcv`.
3. **Build settings:**
   - Framework preset: **None**
   - Build command: `cd client && npm install && npm run build`
   - Build output directory: `client/dist`
   - Root directory: `/` (leave default)
4. **Environment variables** (Settings → Environment variables) → add for **Production** (and Preview):
   - `ANTHROPIC_API_KEY` = your `sk-ant-…` key  ← store as a **Secret**
5. **Save and Deploy.** Cloudflare auto-detects `functions/` and serves `/api/*` from it.

Every push to `main` redeploys automatically.

## Option 2 — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
cd client && npm install && npm run build && cd ..
# one-time: set the API key secret on the Pages project
wrangler pages secret put ANTHROPIC_API_KEY
# deploy (uses wrangler.toml → pages_build_output_dir = client/dist, plus ./functions)
wrangler pages deploy
```

## Notes

- The frontend calls **relative** `/api/...` URLs, so no API base URL to configure —
  same origin as the Pages Functions.
- `ANTHROPIC_API_KEY` lives **only** as a Cloudflare secret. It is never in the repo
  (`.env` is gitignored).
- PDF parsing (pdf.js) runs in the browser; its worker is bundled into `client/dist`.
- Model + token limits live in `functions/api/_shared.js` (mirror of `server/index.js`).
