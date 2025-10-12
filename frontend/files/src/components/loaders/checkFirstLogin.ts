import { redirect } from "react-router";
import api from "../../axios";
import type { LoaderFunctionArgs } from "react-router";
import axios, { type AxiosError } from "axios";
import { useUserContext } from "../contexts/userContext";

export default async function checkFirstLoginLoader() {
  try {
    const res = await api("/user", { withCredentials: true });
    if (!res.data.infos.first_login) return redirect("/");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return redirect("/login");
    }
  }
}
