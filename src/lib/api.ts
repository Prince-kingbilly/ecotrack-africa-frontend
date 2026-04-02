const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = localStorage.getItem('token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  

  get headers() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, responseType?: 'json' | 'blob'): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: { ...this.headers, ...options.headers }
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (responseType === 'blob') {
      return response.blob() as any;
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async get<T>(endpoint: string, options?: { params?: Record<string, any>; responseType?: 'json' | 'blob' }): Promise<T> {
    const query = options?.params ? new URLSearchParams(options.params).toString() : '';
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, {}, options?.responseType);
  }
}

export const api = new ApiClient();
export default api;
