# LedgerOne

React + TypeScript banking demo: OTP login, dashboard with balance and transactions, and an account page with logout. All APIs are mocked.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Mock behaviour

- The browser fetch interceptor (`src/mock/mockFetch.ts`) answers every `/api/*` call with ~400 ms latency.
- The Vite dev server (`vite.config.ts`) serves the same routes, so curl hits identical handlers (`src/mock/mockApi.ts`).
- Demo mobile number `9876543210`, OTP `123456`. Any other 10-digit number also gets an OTP; only `123456` verifies.
- Session token: `mock-session-jwt-token-active`.

## API (curl)

Start `npm run dev` first. Commands below assume `http://localhost:5173`.

### 1. Send OTP

```bash
curl -X POST http://localhost:5173/api/auth/otp \
  -H 'Content-Type: application/json' \
  -d '{"phone":"9876543210"}'
```

Response `200`:

```json
{ "message": "OTP sent", "expiresInSeconds": 300, "mockOtp": "123456" }
```

### 2. Verify OTP (login)

```bash
curl -X POST http://localhost:5173/api/auth/verify \
  -H 'Content-Type: application/json' \
  -d '{"phone":"9876543210","otp":"123456"}'
```

Response `200`:

```json
{ "token": "mock-session-jwt-token-active" }
```

Wrong OTP returns `401 {"error":"Invalid OTP"}`. A malformed phone returns `400`.

### 3. Get account

```bash
curl http://localhost:5173/api/account \
  -H 'Authorization: Bearer mock-session-jwt-token-active'
```

Response `200`:

```json
{
  "account": {
    "name": "Asha Rao",
    "phone": "9876543210",
    "email": "asha.rao@ledgerone.io",
    "accountName": "Savings Account",
    "accountNumber": "920010048210943",
    "ifsc": "HDFC0000240",
    "balanceMinor": 24567890,
    "currency": "INR"
  }
}
```

`balanceMinor` is in paise (`24567890` = ₹2,45,678.90).

### 4. Get transactions

```bash
curl http://localhost:5173/api/transactions \
  -H 'Authorization: Bearer mock-session-jwt-token-active'
```

Response `200`: `{ "transactions": [ { "id", "title", "subtitle", "amountMinor", "direction": "CREDIT" | "DEBIT", "timestamp" } ] }`

### 5. Logout

```bash
curl -X POST http://localhost:5173/api/auth/logout \
  -H 'Authorization: Bearer mock-session-jwt-token-active'
```

Response `200`: `{ "ok": true }`

### Errors

| Case | Status | Body |
|---|---|---|
| Bad phone format | 400 | `{"error":"Enter a valid 10-digit mobile number"}` |
| Wrong OTP | 401 | `{"error":"Invalid OTP"}` |
| Missing or wrong bearer token | 401 | `{"error":"Missing or invalid session token"}` |
| Unknown route | 404 | `{"error":"No mock route for ..."}` |

Logout is stateless in the mock: the token stays valid for curl after logout. The browser drops its local copy on logout.
