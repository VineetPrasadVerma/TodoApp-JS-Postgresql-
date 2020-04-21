const express = require('express')
const router = express.Router()
const { listQueries } = require('../controllers/lists')

// INDEX ROUTE
router.get('/', listQueries.getAllLists)

// READ ROUTE
router.get('/:id', listQueries.getListById)

// CREATE ROUTE
router.post('/', listQueries.createList)

// UPDATE ROUTE
router.put('/:id', listQueries.updateList)

// DELETE ROUTE
router.delete('/:id', listQueries.deleteList)

module.exports = router
