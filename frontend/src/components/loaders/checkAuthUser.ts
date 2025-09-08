import { redirect } from "react-router";
import api from "../../axios";
import axios from "axios";

export default async function checkAuthLoader() {
  try {
    await api.get("/login/verify", { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status == 401 && error.response?.data.error == "NOT LOGGED_IN") {
      return redirect("/login");
    }
  }
}