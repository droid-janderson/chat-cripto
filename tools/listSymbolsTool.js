import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const listSymbols = new DynamicStructuredTool({
  name: "listSymbols",
  description: "List all Symbols",
  schema: z.object({
    symbol: z.string().describe("the name of the symbol"),
  }),
  func: async ({ symbol }) => {
    try {
      const response = await api.get("/symbols");
      // console.log(response.data);
      // const symbolResponse = response.data.symbol.find(
      //   (item) => item.toLowerCase() === symbol.toLowerCase()
      // );

      // console.log(symbolResponse);
      return JSON.stringify(response.data.symbol);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
  required: {
    symbol: false,
  },
});

export default listSymbols;
