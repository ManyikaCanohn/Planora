import Cookies from "js-cookie";

// Save token
export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 1 });
};

// Get token
export const getToken = () => {
  return Cookies.get("token");
};

// Remove token (logout)
export const removeToken = () => {
  Cookies.remove("token");
};