import { redirect } from "react-router";
import axios from "axios";
import api from "../../axios";

export async function check2FALoader() {
  try {
    await api.get("/check/2fa", { withCredentials: true });
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status == 401 &&
      error.response?.data.error == "UNAUTHORIZED"
    ) {
      return redirect("/login");
    }
  }
}
