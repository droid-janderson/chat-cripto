import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const getOrderBook = new DynamicStructuredTool({
  name: "getOrderBook",
  description: "Get Order Book From Symbol",
  schema: z.object({
    symbol: z.string().describe("the name of the symbol"),
  }),
  func: async ({ symbol }) => {
    try {
      const response = await api.get(`${symbol}/orderbook`, {
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

export default getOrderBook;
