const express = require('express');
const app = express();
app.use(express.json());
const swaggerUi = require('swagger-ui-express');

let tasks = [];
let nextId = 1;

const openapiSpec = {
  openapi: "3.0.0",
  info: { title: "To-Do API", version: "1.0.0" },
  paths: {
    "/tasks": {
      get: { summary: "Get all tasks", responses: { "200": { description: "OK" } } },
      post: { summary: "Create a task", responses: { "201": { description: "Created" }, "400": { description: "Bad Request" } } }
    },
    "/tasks/{id}": {
      get: { summary: "Get a task by id", responses: { "200": { description: "OK" }, "404": { description: "Not Found" } } },
      put: { summary: "Update a task", responses: { "200": { description: "OK" }, "404": { description: "Not Found" } } },
      delete: { summary: "Delete a task", responses: { "200": { description: "OK" }, "404": { description: "Not Found" } } }
    }
  }
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  const { title, completed } = req.body;
  if (title) task.title = title;
  if (completed !== undefined) task.completed = completed;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
});

app.listen(3000, () => console.log('Server running on port 3000'));