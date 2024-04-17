import { z } from "zod";
import api from "../services/api.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

const listNetworks = new DynamicStructuredTool({
  name: "listNetworks",
  description: "List Networks From Asset",
  schema: z.object({
    asset: z.string().describe("the name of the asset"),
  }),
  func: async ({ asset }) => {
    try {
      const response = await api.get(`/${asset}/networks`);
      // console.log(response.data);
      return JSON.stringify(response.data);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
});

export default listNetworks;
