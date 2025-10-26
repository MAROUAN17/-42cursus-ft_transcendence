import { redirect } from "react-router";
import api from "../../axios";
import axios, { type AxiosError } from "axios";

export default async function checkFirstLoginLoader() {
  try {
    const res = await api("/user", { withCredentials: true });
    if (!res.data.infos.first_login) return redirect("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return redirect("/login");
    }
  }
}
