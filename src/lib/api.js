const DEFAULT_API_URL = import.meta.env.PROD
  ? "https://mmc-mess-backend-production.up.railway.app"
  : "http://127.0.0.1:8000";

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(/\/+$/, "");
const API_BASE_URL = configuredApiUrl.endsWith("/api") ? configuredApiUrl : `${configuredApiUrl}/api`;

function getToken() {
  return sessionStorage.getItem("mess_api_token");
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.detail || "Request failed");
  }

  return data;
}

export function saveSession({ token, role, user }) {
  sessionStorage.setItem("mess_api_token", token);
  sessionStorage.setItem("mess_api_role", role);
  sessionStorage.setItem("mess_api_user", JSON.stringify(user));
  localStorage.removeItem("mess_api_token");
  localStorage.removeItem("mess_api_role");
  localStorage.removeItem("mess_api_user");
}

export function clearSession() {
  sessionStorage.removeItem("mess_api_token");
  sessionStorage.removeItem("mess_api_role");
  sessionStorage.removeItem("mess_api_user");
}

export function loadSession() {
  const token = sessionStorage.getItem("mess_api_token");
  const role = sessionStorage.getItem("mess_api_role");
  const userRaw = sessionStorage.getItem("mess_api_user");
  if (!token || !role || !userRaw) return null;
  try {
    return { token, role, user: JSON.parse(userRaw) };
  } catch {
    clearSession();
    return null;
  }
}
