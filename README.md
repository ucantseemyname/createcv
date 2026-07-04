# Resumix — AI Resume Builder

> Your dream job starts with the perfect resume.

Resumix turns a short guided form into a polished, ATS-optimized resume written by
**Claude AI** (`claude-sonnet-4-6`), rendered in three live templates, and exported
to a print-ready PDF — all with no auth, no database, and no payment setup.

---

## Tech Stack

| Layer    | Tech                                            |
| -------- | ----------------------------------------------- |
| Frontend | React + Vite + Tailwind CSS + React Router      |
| Backend  | Express.js (Node)                               |
| AI       | Anthropic Claude API (`claude-sonnet-4-6`)      |
| PDF      | html2pdf.js                                     |

---

## Project Structure

```
Resumix/
├── client/            # React + Vite app
│   ├── src/
│   │   ├── pages/         # Landing, Build (multi-step form), Resume (output)
│   │   ├── components/    # Navbar, FAQ, icons, hero mockup
│   │   │   └── templates/ # Modern, Minimal, Classic resume templates
│   │   └── context/       # ResumeContext (shared state + localStorage)
│   └── vite.config.js     # dev server + /api proxy → :3001
├── server/            # Express backend
│   └── index.js           # POST /api/generate-resume → Claude
├── .env                   # ANTHROPIC_API_KEY lives here
└── README.md
```

---

## Setup

### 1. Add your API key

Edit **`.env`** in the project root and paste your Anthropic key:

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
PORT=3001
```

Get a key at <https://console.anthropic.com/>.

### 2. Install + run (one command)

```bash
npm run dev
```

This installs both workspaces and starts the Express server (`:3001`) and the
Vite dev server (`:5173`) together.

Then open **<http://localhost:5173>**.

### Run manually (two terminals)

```bash
# terminal 1 — backend
cd server && npm install && npm start

# terminal 2 — frontend
cd client && npm install && npm run dev
```

Vite proxies all `/api/*` calls to the backend, so no CORS config is needed in dev.

---

## How It Works

1. **`/`** — Landing page: hero, stats, how-it-works, features, template previews,
   testimonials, pricing, FAQ, final CTA.
2. **`/build`** — 5-step form (Personal → Experience → Education → Skills → Job Target)
   with a teal progress bar. State is kept in React context and mirrored to
   `localStorage`.
3. **`/resume`** — Posts the form to `POST /api/generate-resume`. The server prompts
   Claude with a 20-year-resume-writer system prompt and returns structured JSON
   (`summary`, `experience[]`, `education[]`, `skills[]`, `languages[]`,
   `certifications[]`). While Claude works, a skeleton loader with a live typing
   effect runs. The result renders into the chosen template; switch templates,
   regenerate, edit, copy a share link, or **Download PDF** (A4, print-ready).

---

## API

### `POST /api/generate-resume`

**Body** — the full form object (`personal`, `experience`, `education`, `extras`,
`target`).

**Returns**

```json
{
  "resume": {
    "summary": "string",
    "experience": [{ "company": "", "title": "", "dates": "", "bullets": ["…"] }],
    "education": [{ "degree": "", "institution": "", "year": "", "field": "" }],
    "skills": ["…"],
    "languages": ["…"],
    "certifications": ["…"]
  }
}
```

### `GET /api/health`

Returns `{ ok, model, hasKey }` — handy for confirming the API key loaded.

---

## Templates

- **Modern** — teal header bar, two-column layout, teal section dividers, Inter.
- **Minimal** — all-white, single column, thin grey dividers, lots of whitespace, Inter.
- **Classic** — centered serif name, underlined section headers, Georgia/serif.

---

## MVP Scope

No auth · no database · no Stripe. Just: **Form → Claude → Resume → PDF**.
