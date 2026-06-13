import axios from 'axios';

let authToken = null;

export function createClient(baseURL) {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests
  client.interceptors.request.use((config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  // Handle 401 responses
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authToken = null;
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return {
    setToken: (token) => {
      authToken = token;
    },
    
    // Machines
    machines: {
      getAll: () => client.get('/api/machines'),
      create: (data) => client.post('/api/machines', data),
      update: (id, data) => client.put(`/api/machines/${id}`, data),
      delete: (id) => client.delete(`/api/machines/${id}`)
    },
    
    // Parts
    parts: {
      getAll: () => client.get('/api/parts'),
      create: (data) => client.post('/api/parts', data),
      update: (id, data) => client.put(`/api/parts/${id}`, data),
      delete: (id) => client.delete(`/api/parts/${id}`)
    },
    
    // Orders
    orders: {
      getAll: () => client.get('/api/orders'),
      create: (data) => client.post('/api/orders', data),
      updateStatus: (id, status) => client.put(`/api/orders/${id}/status`, { status }),
      delete: (id) => client.delete(`/api/orders/${id}`)
    },
    
    // Auth
    auth: {
      getMe: () => client.get('/api/auth/me')
    }
  };
}
