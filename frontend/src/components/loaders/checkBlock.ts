import { redirect } from "react-router";
import api from "../../axios";
import type { LoaderFunctionArgs } from "react-router";
import axios, { type AxiosError } from "axios";

export default async function checkBlockLoader({ params }: LoaderFunctionArgs) {
  const { username } = params;
  try {
    await api.get("/block/check/" + username, { withCredentials: true });
  } catch (error) {
    console.log(error);
    if (
      axios.isAxiosError(error) &&
      error.response?.status == 404 &&
      error.response?.data.error == "User2 Blocked User1"
    ) {
      return redirect("/404");
    }
  }
}
