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
