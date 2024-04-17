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
import getFeesFromAsset from "./tools/getFeesFromAsset.js";
import listNetworks from "./tools/listNetworksTool.js";
import listTickers from "./tools/listTickersTool.js";

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
    "Sempre que houver uma chamada na Tool listTickers, sempre use a função UPPER antes de enviar o paramentro da função."
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

const tools = [listNetworks, listTickers, getFeesFromAsset];

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

const result = await agentExecutor.invoke({
  input: "what is the network from shib, btc, xlm and xrp?",
});
console.log(`${result.input}\n` + `${result.output} \n`);

const result1 = await agentExecutor.invoke({
  input: "List tickers from BTC-BRL",
});

console.log(`${result1.input}\n` + `${result1.output}\n`);

const result2 = await agentExecutor.invoke({
  input: "Qual a taxa de saque do BTC?",
});

console.log(`${result2.input}\n` + `${result2.output}\n`);

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
