const API_BASE = '/api'

export function setToken(token) { localStorage.setItem('token', token) }
export function getToken() { return localStorage.getItem('token') }

export async function api(path, opts = {}) {
  const token = getToken()
  const headers = {'Content-Type': 'application/json', ...(opts.headers || {})}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  try { return await res.json() } catch { return {} }
}
