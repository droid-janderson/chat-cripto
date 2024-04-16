import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
// import { BufferMemory } from "langchain/memory";
import { config } from "dotenv";
import listNetworks from "./tools/tools.js";

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
  // new MessagesPlaceholder("chat_history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
  new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
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

const result1 = await agentExecutor.invoke({
  // input: "what is the network from matic?",
  input: "what is the network from shib, btc and xrp?",
  // input: "what is the network from sol?",
  // input: "what is the network from xlm?",
  // input: "what is the network from pepe?",
  // input: "liste todos os networks e cada uma das sua criptos",
});
console.log(`${result1.input}\n` + `${result1.output} \n`);
