import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Typed request helpers
export const apiClient = {
  get: <T>(url: string, config = {}) => 
    api.get<T>(url, config).then((res) => res.data),
  
  post: <T>(url: string, data?: unknown, config = {}) => 
    api.post<T>(url, data, config).then((res) => res.data),
  
  put: <T>(url: string, data?: unknown, config = {}) => 
    api.put<T>(url, data, config).then((res) => res.data),
  
  delete: <T>(url: string, config = {}) => 
    api.delete<T>(url, config).then((res) => res.data),
}

