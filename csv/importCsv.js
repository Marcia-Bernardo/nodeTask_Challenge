import { parse } from "csv-parse";
import fs from "node:fs";

const databasePath = new URL("../tasks.csv", import.meta.url);

const processFile = async () => {
  const parser = fs.createReadStream(databasePath).pipe(
    parse({
      fromLine: 2,
    })
  );
  for await (const record of parser) {
    fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify({ title: record[0], description: record[1] }),
    });
  }
};
processFile();
