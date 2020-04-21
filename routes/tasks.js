const express = require('express')
const router = express.Router({ mergeParams: true })
const { taskQueries } = require('../controllers/tasks')

// INDEX ROUTE
router.get('/', taskQueries.getOrderedTask)

// CREATE ROUTE
router.post('/', taskQueries.createTask)

// UPDATE ROUTE
router.put('/:taskId', taskQueries.updateTask)

// DELETE ROUTE
router.delete('/:taskId', taskQueries.deleteTask)

// DELETE MORE THAN ONE ROUTE
router.delete('/', taskQueries.deleteCompletedTasks)

module.exports = router
