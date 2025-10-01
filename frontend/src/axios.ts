import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

interface customAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  error: string;
}

const api = axios.create({
  baseURL: "https://localhost:5000",
});

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalReq = error.config as customAxiosRequestConfig;
  const errStatus = error.response?.status;
  const errMssg = error.response?.data as ErrorResponse;
  if (
    errStatus == 401 &&
    errMssg.error == "JWT_EXPIRED" &&
    !originalReq._retry
  ) {
    originalReq._retry = true;
    try {
      await api.post("/jwt/new", {}, { withCredentials: true });
      return api(originalReq);
    } catch (error) {
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
});

export default api;
