const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const API_KEY = process.env.API_KEY;

app.use((req, res, next) => {
  if (req.path === '/health') return next(); // health check stays open

  console.log('Request Headers:', req.headers); // Log the request headers for debugging
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});


let tasks = [];

   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok', version: '1.2' });
   });

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = { id: tasks.length + 1, title: title.trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id/done', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.done = true;
  res.status(200).json(task);
});

if (require.main === module) {
  app.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = app;