import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import axios from 'axios';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js'
import { CsvStream } from './streams/csv.stream.js';

const SERVER_PORT = 3000;

createServer(async (request, response) => {
  try {
    await json(request, response);

    if (
      !routes[request.method] ||
      !routes[request.method].path.test(request.url)
    ) {
      return response.writeHead(404).end();
    }

    const routeParams = request.url.match(routes[request.method].path);
    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    const result = routes[request.method].handler(request, response);

    return response.end(JSON.stringify(result));
  } catch {
    return response.writeHead(500).end();
  }
}).listen(SERVER_PORT, () => console.log(`Running at port ${SERVER_PORT}`));

(() => {
  setTimeout(async () => {
    const csvStream = new CsvStream({
      handleCsvLine: async function({ title, description }) {
        if (title !== 'title' && description !== 'description') {
          await axios.post('http://localhost:3000/tasks', {
            title,
            description,
          });
        }
      }
    });

    const databasePath = new URL('../tasks.csv', import.meta.url);
    const file = await readFile(databasePath, 'utf8');

    csvStream.write(file);
  }, 2e3);
})();
