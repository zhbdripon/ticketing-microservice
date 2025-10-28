import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";


let axiosInstance: AxiosInstance | null = null;

export function getAxiosInstance(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL:
        typeof window === "undefined"
          ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
          : "",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "host": "ticketing.dev",
      },
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(
      (config) => {
        // You can attach tokens here if needed
        // const token = getAuthToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Optional: Handle global errors here
        if (error.response?.status === 401) {
          console.error("Unauthorized, redirecting to login...");
        }
        return Promise.reject(error);
      }
    );
  }

  return axiosInstance;
}

export async function getCookie(){
    const cookieStore = await cookies();
    return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
}
