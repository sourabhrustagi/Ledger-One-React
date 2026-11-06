# LedgerOne: build this project from scratch

This guide recreates the project step by step. Each step gives the exact file to create and its full contents. Do the steps in order.

The app has three screens:

- **Login:** mobile number, then 6-digit OTP (demo: `9876543210` / `123456`).
- **Dashboard:** balance and recent transactions.
- **Account:** profile details and a Log out button.

All APIs are mocked. The browser intercepts `/api/*` calls, and the Vite dev server serves the same routes for curl.

---

## Step 1: Prerequisites

Install Node.js 18 or newer (Node 20+ recommended) and check it:

```bash
node -v
npm -v
```

---

## Step 2: Create the project folder

```bash
mkdir ledgerOne
cd ledgerOne
mkdir -p src/components src/mock public
```

---

## Step 3: Create `package.json`

Create `package.json` in the project root:

```json
{
  "name": "ledgerone",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^1.61.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@types/node": "^24.19.2",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "oxlint": "^1.88.0",
    "typescript": "~6.0.3",
    "vite": "^8.3.4"
  }
}
```

Install the dependencies:

```bash
npm install
```

---

## Step 4: Create the TypeScript configs

**`tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": false,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Step 5: Create the lint and git config

**`.oxlintrc.json`**

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

**`.gitignore`**

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## Step 6: Create the Vite config

**`vite.config.ts`**

This plugin serves `/api/*` from the mock backend, so curl works against `npm run dev`.

```ts
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { mockApi } from './src/mock/mockApi.js'

// Serves /api/* from the mock backend so curl and the browser hit the same routes.
const mockApiPlugin = (): Plugin => ({
  name: 'ledgerone-mock-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()

      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk as Buffer)
      const raw = Buffer.concat(chunks).toString('utf8')
      const body = raw ? JSON.parse(raw) : undefined

      const path = req.url.split('?')[0]
      const result = mockApi(req.method ?? 'GET', path, req.headers.authorization ?? null, body)
      res.statusCode = result.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result.body))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
})
```

Note the `.js` extension on the `mockApi` import. The node tsconfig uses `nodenext` resolution, which requires it.

---

## Step 7: Create `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231D4ED8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='14' x='2' y='5' rx='2'/><line x1='2' x2='22' y1='10' y2='10'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="LedgerOne - Premium Banking, Personal Finance & Double-Entry Ledger Web Application" />
    <title>LedgerOne | Banking & Personal Ledger</title>
    <!-- Modern Typography: Inter & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Step 8: Create the mock backend

The mock routes live in one module. Both the browser interceptor (Step 9) and the Vite plugin (Step 6) call it.

**`src/mock/mockApi.ts`**

```ts
// Mock backend. Shared by the browser fetch interceptor (mockFetch.ts) and the
// Vite dev-server middleware (vite.config.ts), so the app and curl hit the same routes.

export const MOCK_OTP = '123456';
export const MOCK_TOKEN = 'mock-session-jwt-token-active';

export interface MockAccount {
  name: string;
  phone: string;
  email: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  balanceMinor: number; // paise
  currency: 'INR';
}

export interface MockTransaction {
  id: string;
  title: string;
  subtitle: string;
  amountMinor: number; // paise, always positive
  direction: 'CREDIT' | 'DEBIT';
  timestamp: number; // epoch ms
}

export interface MockResponse {
  status: number;
  body: unknown;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const account: MockAccount = {
  name: 'Asha Rao',
  phone: '9876543210',
  email: 'asha.rao@ledgerone.io',
  accountName: 'Savings Account',
  accountNumber: '920010048210943',
  ifsc: 'HDFC0000240',
  balanceMinor: 24567890,
  currency: 'INR',
};

const transactions: MockTransaction[] = [
  { id: 'tx-001', title: 'Monthly Salary Credit', subtitle: 'TechCorp India · NEFT', amountMinor: 21500000, direction: 'CREDIT', timestamp: Date.now() - DAY_MS },
  { id: 'tx-002', title: 'Whole Foods Market', subtitle: 'Groceries · POS 4821', amountMinor: 485000, direction: 'DEBIT', timestamp: Date.now() - 2 * DAY_MS },
  { id: 'tx-003', title: 'Smoke House Deli', subtitle: 'Dining · UPI asha@okaxis', amountMinor: 342000, direction: 'DEBIT', timestamp: Date.now() - 3 * DAY_MS },
  { id: 'tx-004', title: 'Rahul Mehta', subtitle: 'UPI rahul.m@okicici', amountMinor: 120000, direction: 'CREDIT', timestamp: Date.now() - 4 * DAY_MS },
  { id: 'tx-005', title: 'BESCOM Electricity', subtitle: 'Utilities · Consumer 048291039', amountMinor: 50000, direction: 'DEBIT', timestamp: Date.now() - 6 * DAY_MS },
];

const isPhone = (value: unknown): value is string => typeof value === 'string' && /^\d{10}$/.test(value);

const isAuthorized = (authorization: string | null) => authorization === `Bearer ${MOCK_TOKEN}`;

const error = (status: number, message: string): MockResponse => ({ status, body: { error: message } });

/** Routes a mock API call. `path` excludes the query string. */
export function mockApi(method: string, path: string, authorization: string | null, body: unknown): MockResponse {
  const payload = (body ?? {}) as Record<string, unknown>;

  if (method === 'POST' && path === '/api/auth/otp') {
    if (!isPhone(payload.phone)) return error(400, 'Enter a valid 10-digit mobile number');
    return { status: 200, body: { message: 'OTP sent', expiresInSeconds: 300, mockOtp: MOCK_OTP } };
  }

  if (method === 'POST' && path === '/api/auth/verify') {
    if (!isPhone(payload.phone)) return error(400, 'Enter a valid 10-digit mobile number');
    if (payload.otp !== MOCK_OTP) return error(401, 'Invalid OTP');
    return { status: 200, body: { token: MOCK_TOKEN } };
  }

  if (path.startsWith('/api/') && !isAuthorized(authorization)) {
    return error(401, 'Missing or invalid session token');
  }

  if (method === 'POST' && path === '/api/auth/logout') {
    return { status: 200, body: { ok: true } };
  }

  if (method === 'GET' && path === '/api/account') {
    return { status: 200, body: { account } };
  }

  if (method === 'GET' && path === '/api/transactions') {
    return { status: 200, body: { transactions } };
  }

  return error(404, `No mock route for ${method} ${path}`);
}
```

**`src/mock/mockFetch.ts`**

```ts
import { mockApi } from './mockApi';

const LATENCY_MS = 400;

/** Replaces window.fetch so every /api/* call is answered by the mock backend in the browser. */
export function installMockFetch() {
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input), window.location.href);
    if (!url.pathname.startsWith('/api/')) return realFetch(input, init);

    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

    const method = init?.method ?? 'GET';
    const authorization = new Headers(init?.headers).get('Authorization');
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
    const result = mockApi(method, url.pathname, authorization, body);

    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}
```

---

## Step 9: Create the API client

**`src/api.ts`**

```ts
import type { MockAccount, MockTransaction } from './mock/mockApi';

export type { MockAccount as Account, MockTransaction as Transaction };

const TOKEN_KEY = 'ledgerone.session';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const getSessionToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setSessionToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked: the session simply lasts for this page load.
  }
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getSessionToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Request failed');
  return data as T;
}

export const sendOtp = (phone: string) =>
  request<{ message: string; expiresInSeconds: number }>('POST', '/api/auth/otp', { phone });

export const verifyOtp = (phone: string, otp: string) =>
  request<{ token: string }>('POST', '/api/auth/verify', { phone, otp });

export const logout = () => request<{ ok: boolean }>('POST', '/api/auth/logout');

export const getAccount = () => request<{ account: MockAccount }>('GET', '/api/account');

export const getTransactions = () =>
  request<{ transactions: MockTransaction[] }>('GET', '/api/transactions');
```

---

## Step 10: Create the screens

**`src/components/LoginScreen.tsx`**

```tsx
import { useState, type FormEvent } from 'react';
import { sendOtp, verifyOtp } from '../api';

interface LoginScreenProps {
  onLoggedIn: (token: string) => void;
}

export function LoginScreen({ onLoggedIn }: LoginScreenProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const handlePhoneSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await sendOtp(phone);
      setStep('otp');
    });
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      const { token } = await verifyOtp(phone, otp);
      onLoggedIn(token);
    });
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="brand">
          Ledger<span>One</span>
        </h1>

        {error && <p className="error">{error}</p>}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
            <label className="field-label" htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              className="input"
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              autoFocus
            />
            <button className="btn-primary" type="submit" disabled={busy || phone.length !== 10}>
              {busy ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <label className="field-label" htmlFor="otp">Enter the 6-digit OTP sent to {phone}</label>
            <input
              id="otp"
              className="input otp-input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoFocus
            />
            <button className="btn-primary" type="submit" disabled={busy || otp.length !== 6}>
              {busy ? 'Verifying…' : 'Verify & log in'}
            </button>
            <button className="btn-link" type="button" onClick={() => { setStep('phone'); setOtp(''); setError(null); }}>
              Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

**`src/components/Dashboard.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { getTransactions, type Account, type Transaction } from '../api';

const formatInr = (minor: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(minor / 100);

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

interface DashboardProps {
  account: Account;
}

export function Dashboard({ account }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTransactions()
      .then((data) => active && setTransactions(data.transactions))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="dashboard">
      <div className="card balance-card">
        <p className="muted">Hi {account.name.split(' ')[0]}, your balance</p>
        <p className="balance">{formatInr(account.balanceMinor)}</p>
        <p className="muted">
          {account.accountName} · A/c ••••{account.accountNumber.slice(-4)}
        </p>
      </div>

      <div className="dashboard-txns">
        <h2 className="section-title">Recent transactions</h2>

        {error && <p className="error">{error}</p>}
        {!error && !transactions && <p className="muted">Loading transactions…</p>}

        {transactions && (
          <ul className="card tx-list">
            {transactions.map((tx) => (
              <li key={tx.id} className="tx-row">
                <div>
                  <p className="tx-title">{tx.title}</p>
                  <p className="muted">{tx.subtitle}</p>
                  <p className="muted">{formatDate(tx.timestamp)}</p>
                </div>
                <p className={tx.direction === 'CREDIT' ? 'amount credit' : 'amount debit'}>
                  {tx.direction === 'CREDIT' ? '+' : '−'}
                  {formatInr(tx.amountMinor)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
```

**`src/components/AccountPage.tsx`**

```tsx
import { useState } from 'react';
import type { Account } from '../api';

interface AccountPageProps {
  account: Account;
  onLogout: () => Promise<void>;
}

export function AccountPage({ account, onLogout }: AccountPageProps) {
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    await onLogout();
  };

  const rows: [string, string][] = [
    ['Name', account.name],
    ['Mobile', `+91 ${account.phone}`],
    ['Email', account.email],
    ['Account', account.accountName],
    ['Account number', account.accountNumber],
    ['IFSC', account.ifsc],
  ];

  return (
    <section className="account">
      <div className="card">
        <h2 className="section-title">Account details</h2>
        <dl className="details">
          {rows.map(([label, value]) => (
            <div key={label} className="details-row">
              <dt className="muted">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button className="btn-danger" type="button" onClick={handleLogout} disabled={busy}>
        {busy ? 'Logging out…' : 'Log out'}
      </button>
    </section>
  );
}
```

---

## Step 11: Create the app shell and entry point

**`src/App.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { ApiError, getAccount, getSessionToken, logout, setSessionToken, type Account } from './api';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { AccountPage } from './components/AccountPage';
import { Home, User } from 'lucide-react';

type Tab = 'home' | 'account';

export default function App() {
  const [token, setToken] = useState<string | null>(getSessionToken);
  const [tab, setTab] = useState<Tab>('home');
  const [account, setAccount] = useState<Account | null>(null);

  const clearSession = () => {
    setSessionToken(null);
    setToken(null);
    setAccount(null);
    setTab('home');
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    getAccount()
      .then((data) => active && setAccount(data.account))
      .catch((err) => {
        if (active && err instanceof ApiError && err.status === 401) clearSession();
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleLoggedIn = (newToken: string) => {
    setSessionToken(newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // The local session is dropped either way.
    }
    clearSession();
  };

  if (!token) return <LoginScreen onLoggedIn={handleLoggedIn} />;

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          Ledger<span>One</span>
        </span>
      </header>

      <main className="content">
        {!account && <p className="muted">Loading your account…</p>}
        {account && tab === 'home' && <Dashboard account={account} />}
        {account && tab === 'account' && <AccountPage account={account} onLogout={handleLogout} />}
      </main>

      <nav className="bottom-nav">
        <button className={tab === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => setTab('home')}>
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button className={tab === 'account' ? 'nav-item active' : 'nav-item'} onClick={() => setTab('account')}>
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>
    </div>
  );
}
```

**`src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { installMockFetch } from './mock/mockFetch'

installMockFetch()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Step 12: Create the stylesheet

**`src/index.css`**

```css
:root {
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --bg: #0b1220;
  --surface: #111a2e;
  --border: rgba(255, 255, 255, 0.1);
  --text: #f8fafc;
  --muted: #94a3b8;
  --accent: #3b82f6;
  --accent-strong: #1d4ed8;
  --credit: #4ade80;
  --debit: #f87171;
  --danger: #dc2626;
  --radius: 16px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

button,
input {
  font: inherit;
  color: inherit;
}

.muted {
  color: var(--muted);
  font-size: 0.875rem;
}

.brand {
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
}

.brand span {
  color: var(--accent);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
}

.error {
  color: #fca5a5;
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* Forms and buttons */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem 1.5rem;
}

.auth-card .brand {
  display: block;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  outline: none;
}

.input:focus {
  border-color: var(--accent);
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.4em;
}

.btn-primary,
.btn-danger {
  width: 100%;
  margin-top: 1rem;
  padding: 0.9rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  color: #fff;
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}

.btn-primary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-link {
  display: block;
  margin: 0.75rem auto 0;
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.85rem;
  cursor: pointer;
}

/* App shell */
.app {
  max-width: 560px;
  margin: 0 auto;
  min-height: 100vh;
  padding-bottom: 5.5rem;
}

.topbar {
  padding: 1.25rem 1.25rem 0.5rem;
}

.content {
  padding: 0 1.25rem 1.5rem;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 560px;
  display: flex;
  justify-content: space-around;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 0.6rem 0 calc(0.6rem + env(safe-area-inset-bottom));
}

.nav-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: var(--muted);
  cursor: pointer;
}

.nav-item.active {
  color: var(--accent);
}

/* Dashboard */
.balance-card {
  background: linear-gradient(135deg, var(--accent-strong), #1e3a8a);
  border: none;
}

.balance {
  font-size: 2rem;
  font-weight: 800;
  margin: 0.25rem 0;
}

.tx-list {
  padding: 0.25rem 1.25rem;
  list-style: none;
}

.tx-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--border);
}

.tx-row:last-child {
  border-bottom: none;
}

.tx-title {
  font-weight: 600;
}

.amount {
  font-weight: 700;
  white-space: nowrap;
}

.amount.credit {
  color: var(--credit);
}

.amount.debit {
  color: var(--debit);
}

/* Account */
.details {
  margin-top: 0.5rem;
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--border);
}

.details-row:last-child {
  border-bottom: none;
}

.details-row dd {
  text-align: right;
  word-break: break-all;
}

.account .btn-danger {
  margin-top: 1.25rem;
}

.card .section-title {
  margin-top: 0;
}

.account {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Web: sidebar navigation and wider two-column layout */
@media (min-width: 768px) {
  .app {
    max-width: none;
    margin-left: 220px;
    padding-bottom: 0;
  }

  .topbar,
  .content {
    max-width: 960px;
    margin: 0 auto;
  }

  .topbar {
    padding: 1.75rem 2rem 0;
  }

  .content {
    padding: 1.25rem 2rem 2rem;
  }

  .bottom-nav {
    top: 0;
    left: 0;
    bottom: 0;
    width: 220px;
    max-width: none;
    transform: none;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.4rem;
    border-top: none;
    border-right: 1px solid var(--border);
    padding: 1.75rem 1rem;
  }

  .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0.9rem;
    border-radius: 12px;
    font-size: 0.95rem;
  }

  .nav-item.active {
    background: rgba(59, 130, 246, 0.14);
  }

  .dashboard {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
    gap: 1.25rem;
    align-items: start;
  }

  .dashboard-txns .section-title {
    margin-top: 0;
  }

  .account {
    max-width: 640px;
  }
}
```

---

## Step 13: Add the launch script

**`start.sh`** (project root)

```bash
#!/usr/bin/env bash
# Launches the LedgerOne website (with the mock API) on http://localhost:5173
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js 18+ and try again." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting LedgerOne at http://localhost:5173 (demo login: 9876543210 / OTP 123456)"
exec npm run dev -- "$@"
```

Make it executable:

```bash
chmod +x start.sh
```

---

## Step 14: Build, lint and run

```bash
npm run build
npm run lint
./start.sh
```

Open http://localhost:5173 in a desktop browser and in a phone-sized view (DevTools device mode).

1. Enter `9876543210` and click **Send OTP**.
2. Enter `123456` and click **Verify & log in**.
3. You land on the Dashboard with the balance and transactions.
4. Click **Account**, then **Log out**.

---

## Step 15: Test the APIs with curl

With the dev server running:

```bash
curl -X POST http://localhost:5173/api/auth/otp -H 'Content-Type: application/json' -d '{"phone":"9876543210"}'
curl -X POST http://localhost:5173/api/auth/verify -H 'Content-Type: application/json' -d '{"phone":"9876543210","otp":"123456"}'
curl http://localhost:5173/api/account -H 'Authorization: Bearer mock-session-jwt-token-active'
curl http://localhost:5173/api/transactions -H 'Authorization: Bearer mock-session-jwt-token-active'
curl -X POST http://localhost:5173/api/auth/logout -H 'Authorization: Bearer mock-session-jwt-token-active'
```

---

## Responsive behaviour (what Step 12 gives you)

| Width | Layout |
|---|---|
| Below 768px (phone) | Single column, bottom tab bar (Dashboard / Account) |
| 768px and up (web) | Left sidebar navigation, dashboard split into balance card and transactions list |

---

## Final file tree

```
ledgerOne/
├── .gitignore
├── .oxlintrc.json
├── BUILD_FROM_SCRATCH.md
├── README.md
├── index.html
├── package.json
├── package-lock.json        (generated by npm install)
├── start.sh
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── api.ts
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── AccountPage.tsx
    │   ├── Dashboard.tsx
    │   └── LoginScreen.tsx
    └── mock/
        ├── mockApi.ts
        └── mockFetch.ts
```

`README.md` is the API and run reference. It is optional for the build.
