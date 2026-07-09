# Deploy createcv to Cloudflare (Workers + Static Assets)

One Cloudflare Worker serves both the built React SPA (via the `ASSETS` binding)
and the `/api/*` routes (`worker/index.js`). The local Express server (`server/`)
is only for `npm run dev` on your machine.

Key files: `wrangler.toml`, `worker/index.js`, `worker/shared.js`, build output `client/dist`.

## Option 1 — Git integration (recommended)

1. Push this repo to GitHub (done: `ucantseemyname/createcv`).
2. Cloudflare dashboard → **Workers & Pages → Create → Workers → Connect to Git** (or "Import a repository") → pick `createcv`.
3. **Build settings:**
   - Build command: `cd client && npm install && npm run build`
   - Deploy command: `npx wrangler deploy`
   - (Root directory: leave as `/`.)
4. **Variables & Secrets** → add:
   - `ANTHROPIC_API_KEY` = your `sk-ant-…` key → **Encrypt** (secret)
5. **Save and Deploy.** Every push to `main` redeploys.

> Why this shape: Cloudflare now unifies Pages into Workers. `wrangler deploy` needs
> a Worker entry (`main = worker/index.js`) and an assets dir (`[assets] directory =
> ./client/dist`). The `not_found_handling = "single-page-application"` makes client
> routes like `/build` and `/analyze` serve `index.html`.

## Option 2 — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
# build the SPA, then deploy the Worker + assets
npm run deploy            # = cf:build (vite build) + wrangler deploy
# one-time: set the API key secret
wrangler secret put ANTHROPIC_API_KEY
```

## Notes

- The frontend calls **relative** `/api/...` URLs → same origin as the Worker, no base URL to set.
- `ANTHROPIC_API_KEY` lives only as a Cloudflare secret; `.env` is gitignored.
- PDF parsing (pdf.js) runs in the browser; its worker is bundled into `client/dist`.
- Model + token limits: `worker/shared.js` (mirror of `server/index.js`).
