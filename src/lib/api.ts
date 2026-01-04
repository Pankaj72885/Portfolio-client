import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  // Get token from Firebase auth (will be implemented)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const profileApi = {
  get: () => api.get("/profile"),
  update: (data: Record<string, unknown>) => api.put("/profile", data),
  create: (data: Record<string, unknown>) => api.post("/profile", data),
};

export const skillsApi = {
  getAll: () => api.get("/skills"),
  get: (id: string) => api.get(`/skills/${id}`),
  create: (data: Record<string, unknown>) => api.post("/skills", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export const projectsApi = {
  getAll: (featured?: boolean) =>
    api.get("/projects", { params: { featured } }),
  get: (slug: string) => api.get(`/projects/${slug}`),
  create: (data: Record<string, unknown>) => api.post("/projects", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const experienceApi = {
  getAll: () => api.get("/experience"),
  get: (id: string) => api.get(`/experience/${id}`),
  create: (data: Record<string, unknown>) => api.post("/experience", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};

export const blogApi = {
  getAll: (tag?: string) => api.get("/blog", { params: { tag } }),
  getAllAdmin: () => api.get("/blog/admin"),
  get: (slug: string) => api.get(`/blog/${slug}`),
  create: (data: Record<string, unknown>) => api.post("/blog", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
  like: (id: string) => api.post(`/blog/${id}/like`),
  addComment: (id: string, content: string) =>
    api.post(`/blog/${id}/comments`, { content }),
  deleteComment: (postId: string, commentId: string) =>
    api.delete(`/blog/${postId}/comments/${commentId}`),
};

export const contactApi = {
  send: (data: Record<string, unknown>) => api.post("/contact", data),
  getAll: (unread?: boolean) => api.get("/contact", { params: { unread } }),
  markRead: (id: string) => api.put(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

export const authApi = {
  sync: () => api.post("/auth/sync"),
  me: () => api.get("/auth/me"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/auth/profile", data),
};
