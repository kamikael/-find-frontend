// src/services/api.js
// Client API Laravel: /api/v1/...

const API_BASE =
  (import.meta?.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
    /\/$/,
    ""
  );

const V1 = `${API_BASE}/v1`;

// 🔥 HTTP intelligent (JSON OU multipart)
async function http(path, options = {}) {
  const isFormData = options?.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // ⚠️ IMPORTANT: ne pas forcer Content-Type en multipart
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${V1}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return data;
}

// ---------- Helpers ----------

export function toPublicId(doc) {
  return String(doc?._id || doc?.id || "");
}

// ⚠️ on garde pour compat si besoin
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// ---------- API ----------

export async function getSectors() {
  return http("/sectors", { method: "GET" });
}

export async function getSector(id) {
  return http(`/sectors/${encodeURIComponent(id)}`, { method: "GET" });
}

export async function getProviders() {
  return http("/providers", { method: "GET" });
}

// ✅ version JSON (legacy)
export async function createCandidature(payload) {
  return http("/candidatures", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔥 VERSION MULTIPART (LA BONNE)
export async function createCandidatureMultipart(formData) {
  return http("/candidatures", {
    method: "POST",
    body: formData,
  });
}