import fs from "fs";
import path from "path";
import { toSnakeCase } from "./common";

const modelsDirectory = path.join(process.cwd(), "public", "data", "models");
const visualStyleCombination = path.join(
  process.cwd(),
  "public",
  "data",
  "visual-style"
);

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
    acc[toSnakeCase(model.id)] = model.data;
    return acc;
  }, models);

  return models;
}

export function readVisualStyles() {
  const visualStyles = Object.assign({});
  //

  const fileNames = fs.readdirSync(visualStyleCombination);
  const allVisualStyle = fileNames.map((fileName) => {
    const id = fileName.replace(/\.csv$/, "");
    //
    const fullPath = path.join(visualStyleCombination, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    //
    const simpleDataObject = convertCsvToCompositionJson(fileContent);

    return {
      id,
      data: simpleDataObject,
    };
  });

  allVisualStyle.reduce((acc, model) => {
    acc[toSnakeCase(model.id)] = model.data;
    return acc;
  }, visualStyles);

  return visualStyles.combination;
}

export function convertCsvToCompositionJson(fileContent) {
  const rows = fileContent.trim().split("\n");
  const headers = rows[0].split(",");
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    const obj = {};

    let currentHeader = "";
    let prefixSymbol = "";
    for (let j = 0; j < headers.length; j++) {
      if (headers[j]) {
        currentHeader = toSnakeCase(headers[j].trim());
      }

      if (currentHeader === "prefix") {
        prefixSymbol = row[j].trim();
        continue;
      }

      if (!obj[currentHeader]) {
        obj[currentHeader] = {
          prefix: prefixSymbol,
          values: [],
        };
        //
        prefixSymbol = "";
      }

      obj[currentHeader].values.push(row[j].trim());
    }

    data.push(obj);
  }

  return data;
}

export function convertCsvToJson(fileContent) {
  const rows = fileContent.trim().split("\n");
  const headers = rows[0].split(",");
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[toSnakeCase(headers[j].trim())] = row[j].trim();
    }

    data.push(obj);
  }

  return data;
}
