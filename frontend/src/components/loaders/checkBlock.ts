import { redirect } from "react-router";
import api from "../../axios";
import type { LoaderFunctionArgs } from "react-router";
import axios, { type AxiosError } from "axios";

export default async function checkBlockLoader({ params }: LoaderFunctionArgs) {
  const { username } = params;
  try {
    await api.get("/block/check/" + username, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return redirect("/404");
    }
  }
}
