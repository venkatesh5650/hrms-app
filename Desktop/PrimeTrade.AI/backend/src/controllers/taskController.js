const Task = require('../models/task');

// Get all tasks with optional search & filter
const getTasks = async (req, res) => {
  try {
    const { q = '', status = '' } = req.query;
    const where = { userId: req.user.id };

    if(q) where.title = { [require('sequelize').Op.like]: `%${q}%` };
    if(status) where.status = status;

    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if(!title) return res.status(400).json({ msg: 'Title required' });

    const task = await Task.create({ title, description, userId: req.user.id });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if(!task) return res.status(404).json({ msg: 'Task not found' });

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if(!task) return res.status(404).json({ msg: 'Task not found' });

    await task.destroy();
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
