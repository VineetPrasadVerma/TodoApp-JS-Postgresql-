const express = require('express')
const router = express.Router({ mergeParams: true })
const { queriesObject } = require('../queries')

// INDEX ROUTE
router.get('/', queriesObject.getOrderedTask)

// CREATE ROUTE
router.post('/', queriesObject.createTask)

// UPDATE ROUTE
router.put('/:taskId', queriesObject.updateTask)

// DELETE ROUTE
router.delete('/:taskId', queriesObject.deleteTask)

// DELETE MORE THAN ONE ROUTE
router.delete('/', queriesObject.deleteCompletedTasks)

module.exports = router
