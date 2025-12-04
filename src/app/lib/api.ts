// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function api(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}
