const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(path: string, options: any = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Default options including credentials for sessions cookies
  const defaultOptions: any = {
    credentials: 'include',
    headers: {},
    ...options,
  };

  // Add authorization header if token is stored in localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vestra_session_token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Automatically JSON stringify body and add JSON header if applicable
  if (options.body && !(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
    defaultOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = (data && data.error) || 'Something went wrong';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`apiClient Error [${options.method || 'GET'} ${path}]:`, error);
    throw error;
  }
}

export const apiClient = {
  get: (path: string, options: any = {}) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options: any = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path: string, body?: any, options: any = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path: string, body?: any, options: any = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options: any = {}) => request(path, { ...options, method: 'DELETE' }),
};
