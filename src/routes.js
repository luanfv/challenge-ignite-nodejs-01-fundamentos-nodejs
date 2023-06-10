import { randomUUID } from 'node:crypto';

const database = [];

export const routes = {
  POST: {
    path: '/tasks',
    handler: (request, response) => {
      const { title, describe } = request.body;

      const task = {
        id: randomUUID(),
        title,
        describe,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.push(task);
      response.writeHead(201);

      return task;
    },
  },
  GET: {
    path: '/tasks',
    handler: (_request, _response) => {
      return database;
    },
  },
  PUT: {
    path: '/tasks/:id',
  },
  PATCH: {
    path: '/tasks/:id/complete',
  },
  DELETE: {
    path: '/tasks/:id',
  },
};
