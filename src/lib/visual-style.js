import fs from "fs";
import path from "path";

const modelsDirectory = path.join(process.cwd(), "public", "data", "models");

export function readModels() {
  const models = {};

  const fileNames = fs.readdirSync(modelsDirectory);
  const allModelsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.csv$/, "");
    //
    const fullPath = path.join(modelsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    //
    const simpleDataObject = convertCsvToJson(fileContent);

    return {
      id,
      data: simpleDataObject,
    };
  });

  allModelsData.reduce((acc, model) => {
    acc[model.id] = model.data;
    return acc;
  }, models);

  return models;
}

export function convertCsvToJson(fileContent) {
  const rows = fileContent.trim().split("\n");
  const headers = rows[0].split(",");
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }

    data.push(obj);
  }

  return data;
}
