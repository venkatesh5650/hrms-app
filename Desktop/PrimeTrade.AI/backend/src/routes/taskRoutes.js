const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// All routes protected
router.use(auth);

router.get('/', getTasks);          // GET /api/tasks?q=&status=
router.post('/', createTask);       // POST /api/tasks
router.put('/:id', updateTask);     // PUT /api/tasks/:id
router.delete('/:id', deleteTask);  // DELETE /api/tasks/:id

module.exports = router;
