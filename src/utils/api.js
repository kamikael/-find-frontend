// src/services/api.js
// Client API Laravel: /api/v1/...

const PRIMARY_API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL || "http://127.0.0.1:18000/api"
).replace(/\/$/, "");

const API_BASE_CANDIDATES = [
  PRIMARY_API_BASE,
  "http://127.0.0.1:18000/api",
  "http://localhost:18000/api",
].filter((base, index, arr) => arr.indexOf(base) === index);

// 🔥 HTTP intelligent (JSON OU multipart)
async function http(path, options = {}) {
  const method = String(options?.method || "GET").toUpperCase();
  const isFormData = options?.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // ⚠️ IMPORTANT: ne pas forcer Content-Type en multipart
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const basesToTry =
    method === "GET" ? API_BASE_CANDIDATES : [PRIMARY_API_BASE];

  let res = null;
  let lastNetworkError = null;

  for (const base of basesToTry) {
    try {
      const candidate = await fetch(`${base}/v1${path}`, {
        ...options,
        headers,
      });

      if (candidate.ok || method !== "GET" || candidate.status !== 404) {
        res = candidate;
        break;
      }
    } catch (error) {
      lastNetworkError = error;
    }
  }

  if (!res) {
    throw (
      lastNetworkError ||
      new Error("Impossible de joindre l'API backend.")
    );
  }

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
  // Some local environments have another service answering 200 on a port.
  // We only accept payloads that look like sectors arrays.
  for (const base of API_BASE_CANDIDATES) {
    try {
      const res = await fetch(`${base}/v1/sectors`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) continue;

      const payload = await res.json().catch(() => null);
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : null;

      if (Array.isArray(list) && list.every((item) => item && typeof item === "object")) {
        return list;
      }
    } catch {
      // Try next candidate
    }
  }

  throw new Error("Impossible de recuperer la liste des secteurs.");
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
