import axios from "axios";

export let CSVProcessor = {};

CSVProcessor.loadCSVFormat = loadCSVFormat;

const CSVFormatURL =
  "https://86d3-2001-f77-d20-1a00-2d19-f714-913c-fc40.ngrok.io/config/product_csv.json";
async function loadCSVFormat() {
  const res = await axios.get(CSVFormatURL);
  return JSON.parse(JSON.stringify(res.data));
}
