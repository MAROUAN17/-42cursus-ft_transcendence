import { redirect } from "react-router";
import axios from "axios";

export async function checkAuthLoader() {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check/login`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status == 401 && error.response?.data.error == "NOT LOGGED_IN") {
      return redirect("/login");
    }
  }
}

export async function checkLoginPageLoader() {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check/login-page`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status == 401 && error.response?.data.error == "LOGGED_IN") {
      return redirect("/dashboard");
    }
  }
}
