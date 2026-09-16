# ReviewBot 🤖

**AI-powered pull request reviews that ship faster.**

ReviewBot reads your GitHub pull requests like a senior engineer — catching bugs, security holes, and performance issues in seconds using a multi-agent LLM pipeline.

> Paste a PR URL → get a structured report with severity-scored issues, a risk score, and a plain-English summary.

---

## 🏗️ Architecture

ReviewBot is split into three independent services:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                  │      │                   │      │                 │
│    Frontend      │─────▶│     Backend       │─────▶│  AI Engine      │
│  (React + Vite)  │      │ (Node / Express)  │      │ (Python/FastAPI)│
│                  │◀─────│                   │◀─────│                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                         │                          │
        ▼                         ▼                          ▼
      Clerk                   MongoDB                    Groq LLM +
     (Auth)                  (Persistence)               GitHub API
```

| Layer | Repo | Stack |
|---|---|---|
| **Frontend** | `codereview-ai-frontend` | React, Vite, Clerk |
| **Backend** | `codereview-ai-backend` | Node.js, Express 5, MongoDB (Mongoose), Clerk |
| **AI Engine** | `codereview-ai-engine` | Python, FastAPI, LangChain, LangGraph, Groq |

**Request flow:** a signed-in user pastes a GitHub PR link on the frontend → the backend verifies their Clerk session and forwards the URL to the Python engine → the engine fetches the PR diff from GitHub, runs it through a multi-agent LangGraph pipeline, and returns a structured report → the backend saves the report to MongoDB and returns it to the frontend for display.

---

## ✨ Features

- 🔐 **Authentication** via Clerk (sign up, sign in, session management)
- 🧠 **Multi-agent AI review pipeline** — three agents run in parallel:
  - `bug_agent` — detects logic errors, undefined variables, syntax issues
  - `security_agent` — flags security vulnerabilities in the diff
  - `performance_agent` — flags inefficient or risky patterns
  - Results are merged by a `risk_agent` (produces an overall risk score) and summarized by a `summary_agent`
- 📊 **Structured JSON reports** — each issue includes file, line, code snippet, explanation, suggested fix, type, and severity
- 📁 **Analysis history** — every past report is saved per user and retrievable later
- ⚡ **Fast inference** via Groq's LPU-backed models

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- Clerk React SDK (`@clerk/clerk-react`)
- Tailwind CSS

**Backend**
- Express 5
- MongoDB + Mongoose
- Clerk Express SDK (`@clerk/express`) for auth middleware
- Axios (proxies requests to the AI engine)

**AI Engine**
- FastAPI + Uvicorn/Gunicorn
- LangChain + LangGraph (agent orchestration)
- Groq (`gpt-oss-120b`) via the OpenAI-compatible API
- GitHub REST API (PR diff extraction)

---

## 🚀 Getting Started

Each service runs independently. You'll need three terminals.

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Clerk](https://clerk.com) application
- A [Groq](https://console.groq.com) API key
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (read-only, public repos)

### 1. AI Engine

```bash
cd codereview-ai-engine
pip install fastapi uvicorn pydantic requests python-dotenv langchain langchain-core langchain-openai langgraph gunicorn
```

Create a `.env` file:
```dotenv
GROQ_API_KEY=your_groq_key
GITHUB_TOKEN=your_github_pat
```

Run it:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Backend

```bash
cd codereview-ai-backend
npm install
```

Create a `.env` file:
```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
PYTHON_URL=http://localhost:8000/analyze
```

Run it:
```bash
node index.js
```

### 3. Frontend

```bash
cd codereview-ai-frontend
npm install
```

Create a `.env` file:
```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

Run it:
```bash
npm run dev
```

Visit `http://localhost:5173`, sign in, and paste a GitHub PR URL to try it out.

---

## 📡 API Reference

### Backend — `POST /api/Reports/create`
Creates a new PR analysis. Requires an authenticated Clerk session.

```json
{
  "pr_url": "https://github.com/owner/repo/pull/123"
}
```

### Backend — `GET /api/Reports/AllReports`
Returns all past reports for the authenticated user.

### AI Engine — `POST /analyze`
Runs the full agent pipeline on a PR and returns a structured report.

```json
{
  "pr_url": "https://github.com/owner/repo/pull/123"
}
```

**Response:**
```json
{
  "issues": [
    {
      "file": "src/app.js",
      "line": 42,
      "code": "const x = y + 1;",
      "issue": "y is undefined",
      "fix": "Define y before using it",
      "type": "bug",
      "severity": "high"
    }
  ],
  "risk_score": 72,
  "risk_summary": "...",
  "final_summary": "..."
}
```

---

## 🗺️ Roadmap

- [ ] Wire up billing/subscriptions (Stripe)
- [ ] Connect the `fixes_agent` (currently defined but not part of the active graph)
- [ ] Add inline PR comments via the GitHub API
- [ ] Support private repositories
- [ ] Streaming responses for real-time review progress

---

## 📄 License

MIT
