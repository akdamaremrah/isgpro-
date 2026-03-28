import { API_BASE } from '../config/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('isg_token');
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Only set Content-Type to json if not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('isg_token');
    localStorage.removeItem('isg_user');
    window.location.href = '/login';
  }
  return res;
}

// Re-export API_BASE for convenience
export { API_BASE };
