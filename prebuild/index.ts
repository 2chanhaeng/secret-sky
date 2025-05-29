import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

async function importAndRunMainFunctions() {
  const directoryPath = path.join(__dirname);
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    if (file.endsWith(".ts") && file !== "index.ts") {
      const filePath = pathToFileURL(path.join(directoryPath, file)).href;
      const mod = await import(filePath);
      if (mod.main && typeof mod.main === "function") {
        mod.main();
      }
    }
  }
}

importAndRunMainFunctions().catch(console.error);
