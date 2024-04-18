import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const listTickers = new DynamicStructuredTool({
  name: "listTickers",
  description: "List Tickers From Symbol",
  schema: z.object({
    symbols: z.string().describe("Symbol to list tickers from (e.g. BTC-BRL)"),
  }),
  func: async ({ symbols }) => {
    try {
      const response = await api.get("/tickers", {
        params: {
          symbols,
        },
      });
      // console.log(response.data);
      return JSON.stringify(response.data);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
});

export default listTickers;
