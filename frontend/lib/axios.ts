import { siteConfig } from "@/config";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL: siteConfig.backend_url,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch {
    return true;
  }
};

const handleLogout = () => {
  useAuthStore.getState().clearTokens();
  redirect("/iniciar-sesion");
};

api.interceptors.request.use(
  async (config) => {
    const { tokens, setTokens } = useAuthStore.getState();

    if (tokens.access && isTokenExpired(tokens.access)) {
      try {
        const response = await axios.post(
          `${siteConfig.backend_url}/token/refresh/`,
          {
            refresh: tokens.refresh,
          }
        );
        const { access } = response.data;
        setTokens(access, tokens.refresh!);
        config.headers.Authorization = `Bearer ${access}`;
      } catch (error) {
        handleLogout();
        return Promise.reject(error);
      }
    } else if (tokens.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);
// const fetcher = async (url: string) => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return api.get(url).then((res) => res.data);
// };
const fetcher = (url: string) => api.get(url).then((res) => res.data);
export { api, fetcher };
