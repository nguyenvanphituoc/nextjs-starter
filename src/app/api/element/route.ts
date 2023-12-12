import { NextResponse, type NextRequest } from "next/server";

import { headers } from "next/headers";

import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { toSnakeCase } from "@/lib/common";

const modelsDirectory = path.join(process.cwd(), "public", "data", "models");
const visualStyleCombination = path.join(
  process.cwd(),
  "public",
  "data",
  "visual-style"
);

export async function GET(request: Request) {
  const models: any = {};

  const fileNames = fs.readdirSync(modelsDirectory);
  const allModelsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const results: any = [];
      const id = fileName.replace(/\.csv$/, "");
      //
      const fullPath = path.join(modelsDirectory, fileName);
      //
      await new Promise<void>((resolve, reject) =>
        fs
          .createReadStream(fullPath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => {
            resolve();
          })
      );

      return {
        id,
        data: results,
      };
    })
  );

  allModelsData.reduce((acc, model) => {
    acc[toSnakeCase(model.id)] = model.data;
    return acc;
  }, models);

  return new Response(JSON.stringify(models), {
    status: 200,
  });
}
