import axios from "axios";

export const instance = axios.create({
  baseURL: "https://api.mercadobitcoin.net/api/v4",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  },
});
