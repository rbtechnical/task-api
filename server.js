const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let nextId = 1;

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get All Tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Create Task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  
  // Checks for missing or empty/whitespace-only titles
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }

  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Mark Task as Done
app.patch('/tasks/:id/done', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  
  if (Number.isNaN(taskId)) {
    return res.status(400).json({ error: 'invalid task ID' });
  }

  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }

  task.done = true;
  res.status(200).json(task);
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Task API running on ${PORT}`));
}