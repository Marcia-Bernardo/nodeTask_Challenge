import fs from "node:fs/promises";
import { clearScreenDown } from "node:readline";

const databasePath = new URL("../db.json", import.meta.url);

export class StoreTask {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex < 0) {
      return "Task doesn't exist";
    }
    const saveLastData = this.#database[table][rowIndex];
    let completed_at = data.completed_at;
    if (completed_at === true) {
      if (saveLastData.completed_at === null) {
        completed_at = new Date(Date.now()).toUTCString();
      } else {
        completed_at = null;
      }
    }

    let description = data.description;
    if (description === "" || description === undefined) {
      description = saveLastData.description;
    }

    let title = data.title;
    if (title === "" || title === undefined) {
      title = saveLastData.title;
    }

    const updatedTask = {
      id,
      title,
      description,
      completed_at: completed_at,
      created_at: saveLastData.created_at,
      update_at: data.update_at,
    };
    this.#database[table][rowIndex] = updatedTask;
    this.#persist();
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
