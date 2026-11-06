// Mock backend routes. Shared by the browser fetch interceptor (mockFetch.ts) and the
// Vite dev-server middleware (vite.config.ts), so the app and curl hit the same routes.
import type { OtpSentResponse, VerifyOtpResponse } from '../types/api.js';
import { MOCK_OTP, MOCK_TOKEN, mockAccount, mockTransactions } from './mockData.js';

export interface MockResponse {
  status: number;
  body: unknown;
}

const isPhone = (value: unknown): value is string => typeof value === 'string' && /^\d{10}$/.test(value);

const isAuthorized = (authorization: string | null) => authorization === `Bearer ${MOCK_TOKEN}`;

const error = (status: number, message: string): MockResponse => ({ status, body: { error: message } });

/** Routes a mock API call. `path` excludes the query string. */
export function mockApi(method: string, path: string, authorization: string | null, body: unknown): MockResponse {
  const payload = (body ?? {}) as Record<string, unknown>;

  if (method === 'POST' && path === '/api/auth/otp') {
    if (!isPhone(payload.phone)) return error(400, 'Enter a valid 10-digit mobile number');
    const sent: OtpSentResponse = { message: 'OTP sent', expiresInSeconds: 300, mockOtp: MOCK_OTP };
    return { status: 200, body: sent };
  }

  if (method === 'POST' && path === '/api/auth/verify') {
    if (!isPhone(payload.phone)) return error(400, 'Enter a valid 10-digit mobile number');
    if (payload.otp !== MOCK_OTP) return error(401, 'Invalid OTP');
    const verified: VerifyOtpResponse = { token: MOCK_TOKEN };
    return { status: 200, body: verified };
  }

  if (path.startsWith('/api/') && !isAuthorized(authorization)) {
    return error(401, 'Missing or invalid session token');
  }

  if (method === 'POST' && path === '/api/auth/logout') {
    return { status: 200, body: { ok: true } };
  }

  if (method === 'GET' && path === '/api/account') {
    return { status: 200, body: { account: mockAccount } };
  }

  if (method === 'GET' && path === '/api/transactions') {
    return { status: 200, body: { transactions: mockTransactions } };
  }

  return error(404, `No mock route for ${method} ${path}`);
}
