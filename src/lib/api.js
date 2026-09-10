export const API_URL = (import.meta.env?.VITE_API_URL || 'https://api.corallink.web.id').replace(/\/$/, '');
const TOKEN_KEY = 'corallink_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export async function request(path, { auth = false, body, signal, responseType, ...options } = {}) {
  const token = auth ? getToken() : null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options, signal: controller.signal,
      headers: { ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    if (response.ok && responseType === 'blob') return await response.blob();
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.success === false) {
      if (auth && response.status === 401 && token === getToken()) {
        setToken(null);
        window.dispatchEvent(new Event('corallink:unauthorized'));
      }
      const error = new Error(data?.message || data?.error || `Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    if (!data) throw new Error('Invalid server response. Please try again.');
    return path === '/predict' ? data : data.data;
  } catch (error) {
    if (error.name === 'AbortError' && !signal?.aborted) throw new Error('Request timed out. Please try again.');
    if (error instanceof TypeError) throw new Error('Cannot connect to the server. Check your connection and retry.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

export async function predict(image) {
  const body = new FormData();
  body.append('image', image);
  const data = await request('/predict', { method: 'POST', body });
  const condition = data.predicted_class || data.prediction || data.condition || data.class || data.label;
  if (typeof condition !== 'string' || !condition.trim()) throw new Error('Unrecognized AI response. Please try again.');
  return { condition, confidence: data.confidence ?? data.confidence_score ?? null };
}
