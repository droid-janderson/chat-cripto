import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mercadobitcoin.net/api/v4",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
