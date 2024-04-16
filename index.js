import { ChatOpenAI } from "@langchain/openai";
// import { SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { config } from "dotenv";
import listNetworks from "./tools/tools.js";

config();

const chat = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// const content = `Voce deve fazer uma buscar sobre bitcoin usando a tool 'listNetworks'.`;
const variableName = "agent_scratchpad";
const prompt = ChatPromptTemplate.fromMessages([
  // new SystemMessage(content),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
  new MessagesPlaceholder(variableName),
]);

const tools = [listNetworks];

const agent = await createOpenAIFunctionsAgent({
  llm: chat,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  // verbose: true,
  tools,
});

const response = await agentExecutor.invoke({
  // input: "what is the network from matic?",
  input: "what is the network from shib?",
  // input: "what is the network from sol?",
  // input: "what is the network from xlm?",
  // input: "what is the network from pepe?",
});

console.log(response);
