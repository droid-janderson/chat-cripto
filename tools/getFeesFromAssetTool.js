import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const getFeesFromAsset = new DynamicStructuredTool({
  name: "getFeesFromAsset",
  description: "Get Fees From Asset",
  schema: z.object({
    asset: z.string().describe("the name of the symbol"),
    network: z.string().describe("the name of the network"),
  }),
  func: async ({ asset, network }) => {
    try {
      const response = await api.get(`/${asset}/fees`, {
        params: {
          network,
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

export default getFeesFromAsset;
