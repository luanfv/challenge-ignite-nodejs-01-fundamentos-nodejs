import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js'

const database = [];

export const routes = {
  POST: {
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title || !description) {
        response.writeHead(400);

        return;
      }

      const task = {
        id: randomUUID(),
        title,
        description,
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
    path: buildRoutePath('/tasks'),
    handler: (_request, _response) => {
      return database;
    },
  },
  PUT: {
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      if (!title || !description || !id) {
        response.writeHead(400);

        return;
      }

      const indexTask = database.findIndex((item) => item.id === id);

      if (indexTask === -1) {
        response.writeHead(404);

        return { message: 'Task not found' };
      }

      const updatedTask = {
        ...database[indexTask],
        title,
        description,
        updated_at: new Date(),
      };

      database[indexTask] = updatedTask;

      return updatedTask;
    },
  },
  PATCH: {
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;

      if (!id) {
        response.writeHead(400);

        return;
      }

      const indexTask = database.findIndex((item) => item.id === id);

      if (indexTask === -1) {
        response.writeHead(404);

        return { message: 'Task not found' };
      }

      const updatedTask = {
        ...database[indexTask],
        completed_at: new Date(),
        updated_at: new Date(),
      };

      database[indexTask] = updatedTask;

      return updatedTask;
    },
  },
  DELETE: {
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      if (!id) {
        response.writeHead(400);

        return;
      }

      const indexTask = database.findIndex((item) => item.id === id);

      if (indexTask === -1) {
        response.writeHead(404);

        return { message: 'Task not found' };
      }

      database.splice(indexTask, 1);

      return;
    },
  },
};
