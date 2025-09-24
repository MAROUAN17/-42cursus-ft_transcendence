import { redirect } from "react-router";
import api from "../../axios";
import axios from "axios";

export async function checkAuthLoader() {
  try {
    await axios.get("https://localhost:4000/check/login", {
      withCredentials: true,
    });
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status == 401 &&
      error.response?.data.error == "NOT LOGGED_IN"
    ) {
      return redirect("/login");
    }
  }
}

export async function checkLoginPageLoader() {
  try {
    await axios.get("https://localhost:4000/check/login-page", {
      withCredentials: true,
    });
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status == 401 &&
      error.response?.data.error == "LOGGED_IN"
    ) {
      return redirect("/");
    }
  }
}
