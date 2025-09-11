import axios from "axios";
import { configKeys } from "../../configKeys";
const createAxiosInstance = (
  baseURL: string,
  apiKey: string,
  clientKey: string
) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(
    (config) => {
      // const token = localStorage.getItem("authAccessToken");
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

      config.headers["apiKey"] = apiKey;
      config.headers["clientKey"] = clientKey;
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // logout();
      } else if (error.response?.status === 500) {
        console.error("Server error:", error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const userAxiosInstance = createAxiosInstance(
  configKeys.SECOND_NATURE_USER,
  configKeys.SECOND_NATURE_API_KEY,
  configKeys.SECOND_NATURE_CLIENT_KEY
);

const subscriptionAxiosInstance = createAxiosInstance(
  configKeys.SECOND_NATURE_SUBSCRIPTION,
  configKeys.SECOND_NATURE_API_KEY,
  configKeys.SECOND_NATURE_CLIENT_KEY
);

export { userAxiosInstance, subscriptionAxiosInstance };
