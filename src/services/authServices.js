
import api from "../api/axiosInstance.js";

export const authservice = {
  // 1. Register a new user
  async register(formData) {
    const response = await api.post("/auth/register", formData);
    return response.data;
  },

  // 2. Activate the user account
  async activate(activationData) {
    const response = await api.post(
      "/auth/activate-user",
      {
        activation_token: activationData.activationToken,
        activation_code: activationData.activationCode,
      },
      {
        headers: {
          Authorization: `Bearer ${activationData.activationToken}`,
        },
      }
    );

    return response.data;
  },

  // 3. Login an activated user
  async login(formData) {
    const response = await api.post("/auth/login", formData);

    const data = response.data;

    const token =
      data?.token ??
      data?.access_token ??
      data?.accessToken ??
      data?.data?.token ??
      data?.data?.access_token ??
      data?.data?.accessToken ??
      null;

    const user =
      data?.user ??
      data?.data?.user ??
      data?.data?.userData ??
      data?.userData ??
      null;

    // Save authentication details only when returned by the API
    if (token) {
      localStorage.setItem("authToken", token);
    }

    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    }

    return { ...data, token, user };
  },

  // 4. Logout the user
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },

  // 5. Get the currently logged-in user
  getCurrentUser() {
    const user = localStorage.getItem("authUser");

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // 6. Check whether a token exists
  isAuthenticated() {
    return Boolean(localStorage.getItem("authToken"));
  },
};

// Get the user's role
export function getUserRole(user) {
  const role =
    user?.role ??
    user?.user?.role ??
    user?.data?.role ??
    "";

  return typeof role === "string" ? role.toLowerCase() : "";
}
