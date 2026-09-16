# ReviewBot — Frontend

The web client for **ReviewBot**, an AI-powered GitHub pull request reviewer. Users sign in, paste a PR URL, and get back a structured report with bugs, security issues, performance problems, a risk score, and a plain-English summary.

> **This is 1 of 3 services.**
> 🖥️ **Frontend** (you are here) · [⚙️ Backend](https://github.com/shubhutf/codereview-ai-backend) · [🧠 AI Engine](https://github.com/shubhutf/codereview-ai-engine)

---

## Screenshot

<!-- Add a screenshot of the landing page and the analyzer page here -->
<!-- ![ReviewBot landing page](./docs/screenshot.png) -->

---

## What this service does

- Renders the marketing landing page and the authenticated analyzer dashboard
- Handles sign-up / sign-in via **Clerk**
- Sends PR URLs to the backend for analysis
- Displays the returned report and the user's past analysis history

It contains **no AI logic and no database access** — all of that lives in the other two services.

---

## Tech stack

| | |
|---|---|
| Framework | React + Vite |
| Auth | Clerk (`@clerk/clerk-react`) |
| Styling | Tailwind CSS |
| HTTP | Axios |

---

## Getting started

### Prerequisites
- Node.js 18+
- A running instance of the [backend service](https://github.com/shubhutf/codereview-ai-backend)
- A [Clerk](https://clerk.com) application

### Install

```bash
npm install
```

### Configure

Create a `.env` file in the project root:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:5000
```

| Variable | What it's for |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk's public key, from your Clerk dashboard under **Configure → API Keys** |
| `VITE_API_URL` | Base URL of the backend service |

> Vite only exposes variables prefixed with `VITE_` to the browser, and only reads `.env` on server start — restart the dev server after editing it.

### Run

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

> Make sure this URL matches the `CLIENT_URL` set in the backend's `.env`, or requests will be blocked by CORS.

### Build for production

```bash
npm run build
```

---

## Project structure

```
src/
├── pages/
│   ├── GitURL.jsx     # PR submission + analysis history
│   └── Analyzer.jsx   # Report display
└── ...
```

Both pages read the backend base URL from `import.meta.env.VITE_API_URL`.

---

## Deployment

Designed to deploy to **Vercel** (or any static host). Two things to remember:

1. Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` as environment variables in your host's dashboard — the local `.env` file is not deployed.
2. Add your deployed frontend URL to:
   - Clerk's allowed origins
   - the backend's `CLIENT_URL` environment variable

---

## Roadmap

- [ ] Wire up the Pricing page to real billing (Stripe is installed but unused)
- [ ] Stream review progress in real time instead of a single loading state
- [ ] Shareable report links

---

## License

MIT
