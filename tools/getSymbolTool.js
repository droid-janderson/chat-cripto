import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { getTradingSymbol } from "../services/getTradingSymbol.js";

const getSymbolTool = new DynamicStructuredTool({
  name: "getSymbolTool",
  description:
    "Giver an asset name or an asset symbol, returns the asset acronym",
  schema: z.object({
    asset: z.string().optional().describe("the name of the asset"),
    symbol: z
      .string()
      .regex(new RegExp(/([A-Z]){3}/))
      .optional()
      .describe("the name of the asset acronym"),
  }),
  func: async ({ asset, symbol }) => {
    try {
      const response = await getTradingSymbol({
        name: asset,
        symbolName: symbol,
      });
      // console.log(response.data);
      // const symbolResponse = response.data.symbol.find(
      //   (item) => item.toLowerCase() === symbol.toLowerCase()
      // );

      console.log(response.data);
      // return JSON.stringify(response.data.symbol);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
});

export default getSymbolTool;
