import apiClient from "./ApiClient";

const API_URL = "user/login/";

interface LoginResponse {
  access: string;
  refresh: string;
  [key: string]: any; // In case there are additional fields like user info
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(API_URL, { email, password });

    console.log("Login Response:", response.data);
    alert(JSON.stringify(response.data)); // ✅ Debugging

    if (response.data) {
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
    }

    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    alert("Login failed: " + (error.response?.data?.error || "Unknown error"));
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
