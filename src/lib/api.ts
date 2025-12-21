// API Configuration & Services
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://server-production-da32.up.railway.app/api/v1";

// Token management
export const getToken = () => localStorage.getItem("gabrielsolar_token");
export const getRefreshToken = () =>
  localStorage.getItem("gabrielsolar_refresh_token");
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("gabrielsolar_token", access);
  localStorage.setItem("gabrielsolar_refresh_token", refresh);
};
export const clearTokens = () => {
  localStorage.removeItem("gabrielsolar_token");
  localStorage.removeItem("gabrielsolar_refresh_token");
  localStorage.removeItem("gabrielsolar_user");
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<{ data?: T; error?: string; status: number }> {
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail[0]?.msg
          : "Cerere eșuată";
      return { error: errorMessage, status: response.status };
    }

    return { data, status: response.status };
  } catch (error) {
    return { error: "Eroare de rețea. Verificați conexiunea.", status: 0 };
  }
}

// ==================== AUTH API ====================
export const authAPI = {
  register: (userData: any) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  verifyCode: (email: string, code: string) =>
    apiRequest(
      `/auth/verify-code?email=${encodeURIComponent(email)}&code=${code}`,
      { method: "POST" }
    ),

  login: (email: string, password: string, totp_code?: string) =>
    apiRequest<{
      access_token: string;
      refresh_token: string;
      user: any;
      requires_2fa?: boolean;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, totp_code }),
    }),

  refresh: (refreshToken: string) =>
    apiRequest<{ access_token: string; refresh_token: string; user: any }>(
      `/auth/refresh?refresh_token=${refreshToken}`,
      { method: "POST" }
    ),

  logout: (refreshToken: string) =>
    apiRequest(`/auth/logout?refresh_token=${refreshToken}`, {
      method: "POST",
    }),

  logoutAll: () => apiRequest("/auth/logout-all", { method: "POST" }, true),

  forgotPassword: (email: string) =>
    apiRequest(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: "POST",
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest("/auth/reset-password-confirm", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  setup2FA: () =>
    apiRequest<{ qr_code: string; secret: string }>(
      "/auth/2fa/setup",
      { method: "POST" },
      true
    ),

  verify2FA: (code: string) =>
    apiRequest(
      "/auth/2fa/verify-and-enable?code=${code}",
      { method: "POST" },
      true
    ),
};

// ==================== SOLAR CONTENT API ====================
export const solarAPI = {
  getProjects: (type?: string, page: number = 1, size: number = 6) => {
    const query = new URLSearchParams();
    // NOTĂ: Backend-ul FastAPI așteaptă 'type' pentru filtrare conform logurilor tale
    if (type && type !== "Toate Proiectele") query.append("type", type);
    query.append("page", page.toString());
    query.append("size", size.toString());
    return apiRequest<any>(`/solar/projects?${query.toString()}`);
  },
  getProject: (id: string) => apiRequest<any>(`/solar/projects/${id}`),
  getBlogPosts: () => apiRequest<any[]>("/solar/blog"),
  getBlogPost: (slug: string) => apiRequest<any>(`/solar/blog/${slug}`),
  submitContact: (data: any) =>
    apiRequest("/solar/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== SERVICE REQUESTS API (CLIENT) ====================
export const serviceAPI = {
  createRequest: (formData: FormData) =>
    apiRequest("/service-requests/", { method: "POST", body: formData }, true),

  getMyRequests: () =>
    apiRequest<any[]>("/service-requests/my-requests", { method: "GET" }, true),

  acceptReschedule: (id: string) =>
    apiRequest(
      `/service-requests/${id}/accept-reschedule`,
      { method: "POST" },
      true
    ),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getBlogPosts: () => apiRequest<any[]>("/admin/blog", { method: "GET" }, true),

  createBlogPost: (data: any) =>
    apiRequest(
      "/admin/blog",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    ),

  updateBlogPost: (id: string, data: any) =>
    apiRequest(
      `/admin/blog/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true
    ),

  deleteBlogPost: (id: string) =>
    apiRequest(`/admin/blog/${id}`, { method: "DELETE" }, true),

  // --- Projects Management ---
  getProjects: (category?: string, page: number = 1, size: number = 50) => {
    const query = new URLSearchParams();
    if (category && category !== "Toate Proiectele")
      query.append("type", category);
    query.append("page", page.toString());
    query.append("size", size.toString());
    return apiRequest<any>(
      `/solar/projects?${query.toString()}`,
      { method: "GET" },
      true
    );
  },

  createProject: (data: any) =>
    apiRequest(
      "/admin/projects",
      { method: "POST", body: JSON.stringify(data) },
      true
    ),

  updateProject: (id: string, data: any) =>
    apiRequest(
      `/admin/projects/${id}`,
      { method: "PATCH", body: JSON.stringify(data) },
      true
    ),

  deleteProject: (id: string) =>
    apiRequest(`/admin/projects/${id}`, { method: "DELETE" }, true),

  // --- Users Management ---
  getUsers: () => apiRequest<any[]>("/admin/users", {}, true),

  updateUser: (userId: string, userData: any) =>
    apiRequest(
      `/admin/users/${userId}`,
      { method: "PATCH", body: JSON.stringify(userData) },
      true
    ),

  deleteUser: (userId: string) =>
    apiRequest(`/admin/users/${userId}`, { method: "DELETE" }, true),

  // --- Calendar ---
  createCalendarEvent: (eventData: any) =>
    apiRequest(
      "/admin/calendar-events",
      { method: "POST", body: JSON.stringify(eventData) },
      true
    ),

  // --- Leads Management ---
  getLeads: (params: any) => {
    const query = new URLSearchParams();
    query.append("page", params.page.toString());
    query.append("size", params.size.toString());
    if (params.search) query.append("search", params.search);
    if (params.status && params.status !== "all")
      query.append("status", params.status);
    if (params.property_type && params.property_type !== "all")
      query.append("property_type", params.property_type);
    return apiRequest<any>(
      `/admin/leads?${query.toString()}`,
      { method: "GET" },
      true
    );
  },

  // --- Service Requests ---
  getAllServiceRequests: (service_type?: string, status?: string) => {
    const query = new URLSearchParams();
    if (service_type && service_type !== "all")
      query.append("service_type", service_type);
    if (status && status !== "all") query.append("status", status);
    return apiRequest<any[]>(
      `/admin/all?${query.toString()}`,
      { method: "GET" },
      true
    );
  },

  respondToServiceRequest: (id: string, data: any) =>
    apiRequest(
      `/admin/${id}/respond`,
      { method: "PATCH", body: JSON.stringify(data) },
      true
    ),
};

// ==================== CHAT WEBSOCKET ====================
export const createChatConnection = (
  roomUserId: string,
  token: string,
  onMessage: (msg: any) => void,
  onError: (error: any) => void,
  onClose: () => void
) => {
  const wsUrl = `${API_URL.replace(
    "http",
    "ws"
  )}/chat/ws/${roomUserId}?token=${token}`;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("Chat connected");
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error("Failed to parse message", e);
    }
  };
  ws.onerror = onError;
  ws.onclose = onClose;

  return {
    send: (text: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ text }));
      }
    },
    close: () => ws.close(),
    getState: () => ws.readyState,
  };
};

export default { authAPI, solarAPI, serviceAPI, adminAPI };
