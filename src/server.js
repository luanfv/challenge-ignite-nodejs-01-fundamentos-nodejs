import { createServer } from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const SERVER_PORT = 3000;

createServer(async (request, response) => {
  await json(request, response);

  if (
    !request.method ||
    !routes[request.method] ||
    routes[request.method].path !== request.url
  ) {
    return response.writeHead(404).end();
  }

  const result = routes[request.method].handler(request, response);

  response.end(JSON.stringify(result));
}).listen(SERVER_PORT, () => console.log(`Running at port ${SERVER_PORT}`));
