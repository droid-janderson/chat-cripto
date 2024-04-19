import api from "./api.js";

export async function getTradingSymbol({ name, symbolName }) {
  try {
    const response = await api.get("/symbols");
    const { data } = response;
    let foundIndex = -1;
    if (name) {
      foundIndex = data.description.findIndex(
        (el) => el.toLowerCase() === name.toLowerCase()
      );
    }

    if (symbolName) {
      foundIndex = data["base-currency"].findIndex();
      (el) => el.toLowerCase() === symbolName.toLowerCase();
    }

    if (foundIndex == -1) {
      return "Not found";
    }
    return `Symbol name: ${data["base-currency"][foundIndex]}`;
  } catch (error) {
    console.error("Error", error);
    return Error`fetching data: ${error}`;
  }
}
