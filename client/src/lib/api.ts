const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// Specific API calls
export const api = {
  customers: () => fetchAPI("/customers/"),
  interactions: () => fetchAPI("/interactions/"),
  zones: () => fetchAPI("/zones/"),
  tracks: () => fetchAPI("/tracks/"),
  frames: () => fetchAPI("/frames/"),
};
