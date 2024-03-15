import { createServer } from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./router/routes.js";
import { extractQueryParams } from "./util/extractQueryParams.js";

const server = createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.url.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.url);
    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});
server.listen(3333);
