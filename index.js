import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { config } from "dotenv";
import getFeesFromAsset from "./tools/getFeesFromAssetTool.js";
import getOrderBook from "./tools/getOrderBookTool.js";
import listNetworks from "./tools/listNetworksTool.js";
import listSymbols from "./tools/listSymbolsTool.js";
import listTickers from "./tools/listTickersTool.js";
import listTrades from "./tools/listTradesTool.js";

const app = express();
app.use(express.json());

config();

const chat = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "Olá! Eu sou um assistente virtual e posso te ajudar a encontrar informações sobre redes de ativos. Qual ativo você gostaria de saber a rede?"
  ),
  SystemMessagePromptTemplate.fromTemplate(
    "Sempre use a função LOWER para fazer comparações de texto."
  ),
  SystemMessagePromptTemplate.fromTemplate(
    "Sempre descreva as respostas de forma clara e objetiva."
  ),
  SystemMessagePromptTemplate.fromTemplate(
    "Quando houver mais de uma resposta, faça uma lista organizas de forma numerica. Todos as respostas devem ser terminadas em ';', exceto a última da lista que dev ser finalizada com ponto final."
  ),
  SystemMessagePromptTemplate.fromTemplate(
    "Sempre use a função listSymbols para listar todos os símbolos disponíveis."
  ),
  new MessagesPlaceholder("chat_history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
  new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
]);

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  outputKey: "output",
});

const tools = [
  getFeesFromAsset,
  getOrderBook,
  listNetworks,
  listSymbols,
  listTickers,
  listTrades,
];

const agent = await createOpenAIFunctionsAgent({
  llm: chat,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  // verbose: true,
  tools,
  memory,
});

// const result = await agentExecutor.invoke({
//   input: "what is the network from shib?",
// });
// console.log(`${result.input}\n` + `${result.output} \n`);

// const result1 = await agentExecutor.invoke({
//   input: "List tickers from eth-brl.",
// });

// console.log(`${result1.input}\n` + `${result1.output}\n`);

// const result2 = await agentExecutor.invoke({
//   input: "Qual o último preço do eth-brl?",
// });

// console.log(`${result2.input}\n` + `${result2.output}\n`);

// const result3 = await agentExecutor.invoke({
//   input: "List alguns dos symbols disponíveis.",
// });

// console.log(`${result3.input}\n` + `${result3.output}\n`);

// const result4 = await agentExecutor.invoke({
//   input: "List orderbook from eth-brl.",
// });

// console.log(`${result4.input}\n` + `${result4.output}\n`);

const result5 = await agentExecutor.invoke({
  input: "List trades from eth-brl.",
});

console.log(`${result5.input}\n` + `${result5.output}\n`);

app.get("/", (req, res) => {
  return res.json({
    message: "Bem vindo Dev!",
  });
});

app.post("/chat", async (req, res) => {
  const { input } = req.body;

  const result = await agentExecutor.invoke({
    input,
  });

  res.json(result);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
