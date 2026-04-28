import api from "./api"; // your axios instance with withCredentials: true

// =======================
// TYPES
// =======================
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

// =======================
// REGISTER
// =======================
export const registerUser = async (data: RegisterData) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err: any) {
    console.error("REGISTER ERROR:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// LOGIN
// =======================
export const loginUser = async (data: LoginData) => {
  try {
    const res = await api.post("/auth/login", data);

    // 🔥 DEBUG (remove later if you want)
    console.log("LOGIN SUCCESS:", res.data);

    return res.data;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// LOGOUT (OPTIONAL BUT IMPORTANT)
// =======================
export const logoutUser = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err: any) {
    console.error("LOGOUT ERROR:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// GET CURRENT USER (VERY USEFUL FOR DASHBOARD)
// =======================
export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err: any) {
    console.error("GET ME ERROR:", err.response?.data || err.message);
    throw err;
  }
};