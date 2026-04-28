import axios from "axios";

export const getParticipants = (eventId: number) => {
  return api.get(`/invite/${eventId}`);
};

export const updateParticipantStatus = (id: number, status: string) => {
  return api.put(`/invite/${id}`, { status });
};

export const getInvite = (code: string) => {
  if (!code) throw new Error("Invite code missing");
  return api.get(`/invite/${code}`);
};

// =======================
// AXIOS INSTANCE (CORE)
// =======================
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 CRITICAL for JWT cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// OPTIONAL: GLOBAL ERROR LOGGING
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;