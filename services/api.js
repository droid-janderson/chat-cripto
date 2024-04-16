import axios from "axios";

function createApiService() {
  const api = axios.create({
    baseURL: "https://api.mercadobitcoin.net/api/v4",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}

const apiService = createApiService();

export default apiService;
