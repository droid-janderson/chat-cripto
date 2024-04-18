import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const listTrades = new DynamicStructuredTool({
  name: "listTrades",
  description: "List Trades From Symbol",
  schema: z.object({
    symbol: z.string().describe("Symbol to list tickers from (e.g. BTC-BRL)"),
  }),
  func: async ({ symbol }) => {
    try {
      const response = await api.get(`${symbol}/trades`, {
        params: {
          limit: 5,
        },
      });
      return JSON.stringify(response.data);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
});

export default listTrades;
