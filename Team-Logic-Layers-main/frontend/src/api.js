// src/shared/api.js
import axios from 'axios'

export const BASE_URL = 'http://localhost:8080'
// src/api.js
// const BASE_URL = "http://localhost:8000"; // <- change this if your backend runs elsewhere

function handleResp(resp) {
  if (!resp.ok) {
    // try to parse JSON error body
    return resp.json().then((body) => {
      const msg = body?.detail || body?.message || `Request failed (${resp.status})`;
      throw new Error(msg);
    }).catch(() => {
      throw new Error(`Request failed (${resp.status})`);
    });
  }
  return resp.json();
}

// Auth
export async function signup({ name, email, password }) {
  const resp = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResp(resp);
}

export async function login({ email, password }) {
  const resp = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResp(resp);
}

// Helper to build Authorization header
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Upload PDF
export async function uploadPdf(file, token) {
  const fd = new FormData();
  fd.append("file", file, file.name);
  const resp = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { ...authHeaders(token) }, // DO NOT set Content-Type here; browser will set multipart boundary
    body: fd,
  });
  return handleResp(resp);
}

export async function uploadFiles(formData, token) {
  const resp = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { ...authHeaders(token) }, // don't set Content-Type
    body: formData,
  });
  return handleResp(resp);
}

// generate_template (FormData expected)
export async function generateTemplate({ job_id, question, top_k = 5 }, token) {
  const fd = new FormData();
  fd.append("job_id", job_id);
  fd.append("question", question);
  fd.append("top_k", String(top_k));
  const resp = await fetch(`${BASE_URL}/generate_template`, {
    method: "POST",
    headers: { ...authHeaders(token) },
    body: fd,
  });
  return handleResp(resp);
}

// /generate (form fields job_id, sections (stringified) optional)
export async function generateReport({ job_id, sections = null, tone = "formal" }, token) {
  const fd = new FormData();
  fd.append("job_id", job_id);
  if (sections) fd.append("sections", Array.isArray(sections) ? JSON.stringify(sections) : sections);
  fd.append("tone", tone);
  const resp = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { ...authHeaders(token) },
    body: fd,
  });
  return handleResp(resp);
}

// refine
export async function refine({ job_id, instruction }, token) {
  const fd = new FormData();
  fd.append("job_id", job_id);
  fd.append("instruction", instruction);
  const resp = await fetch(`${BASE_URL}/refine`, {
    method: "POST",
    headers: { ...authHeaders(token) },
    body: fd,
  });
  return handleResp(resp);
}

export function downloadUrlFor(job_id) {
  return `${BASE_URL}/download/${job_id}`;
}
