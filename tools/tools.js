import { z } from "zod";
import axios from "axios";
// import { instance } from "../services/api";
import { DynamicStructuredTool } from "@langchain/core/tools";

axios.defaults.baseURL = "https://api.mercadobitcoin.net/api/v4";

const listNetworks = new DynamicStructuredTool({
  name: "listNetworks",
  description: "List Networks From Asset",
  schema: z.object({
    asset: z.string(),
  }),
  func: async ({ asset }) => {
    try {
      const response = await axios.get(`/${asset}/networks`);
      // console.log(response.data);
      return JSON.stringify(response.data);
    } catch (error) {
      console.log("Error", error);
      return Error`fetching data: ${error}`;
    }
  },
});

export default listNetworks;
