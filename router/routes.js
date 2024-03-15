import { StoreTask } from "../store/db.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../util/buildRoutePath.js";

const database = new StoreTask();

export const routes = [
  {
    method: "GET",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      if (title === null || title === undefined || title === "") {
        return res.writeHead(400).end("Necessary title ");
      }
      if (
        description === null ||
        description === undefined ||
        description === ""
      ) {
        return res.writeHead(400).end("Necessary description ");
      }
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(Date.now()).toUTCString(),
        update_at: new Date(Date.now()).toUTCString(),
      };

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const resultUpdate = database.update("tasks", id, {
        title,
        description,
        update_at: new Date(Date.now()).toUTCString(),
      });
      if (resultUpdate === undefined) {
        return res.writeHead(204).end();
      }
      return res.writeHead(400).end(resultUpdate);
    },
  },
  {
    method: "PATCH",
    url: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const resultUpdate = database.update("tasks", id, {
        completed_at: true,
        update_at: new Date(Date.now()).toUTCString(),
      });
      if (resultUpdate === undefined) {
        return res.writeHead(204).end();
      }
      return res.writeHead(400).end(resultUpdate);
    },
  },

  {
    method: "DELETE",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
