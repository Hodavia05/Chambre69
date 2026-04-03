const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function sendRequest(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Une erreur est survenue");
  }

  return data;
}

export function loginUser(payload) {
  return sendRequest("/auth/login", payload);
}

export function registerUser(payload) {
  return sendRequest("/auth/register", payload);
}

export { API_BASE_URL };
