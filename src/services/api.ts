const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    // Always read token fresh from sessionStorage to ensure we have the latest value
    const token = sessionStorage.getItem('zeinab-admin-token');
    
    // Build headers as a plain object (Record<string, string>)
    const headers: Record<string, string> = {};
    
    // Set Content-Type for requests with body
    if (options.body || options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge any existing headers from options (convert to plain object if needed)
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[String(key)] = String(value);
        });
      } else {
        // Plain object - merge directly
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = String(value);
        });
      }
    }
    
    // Add Authorization header if token exists (override any existing Authorization)
    if (token && token.trim()) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }
    
    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        // Clear invalid token
        sessionStorage.removeItem('zeinab-admin-token');
        sessionStorage.removeItem('zeinab-admin-auth');
        const errorText = await response.text().catch(() => 'Unauthorized');
        throw new Error(`Authentication failed: ${errorText}`);
      }
      
      // Provide more detailed error information for other errors
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
  }

  async post<T = unknown, D = Record<string, unknown>>(endpoint: string, data: D, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async get<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async put<T = unknown, D = Record<string, unknown>>(endpoint: string, data: D, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  // Add authorization header for authenticated requests
  setAuthToken(token: string) {
    this.request = this.request.bind(this, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
