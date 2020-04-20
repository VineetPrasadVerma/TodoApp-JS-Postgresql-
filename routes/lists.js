const express = require('express')
const router = express.Router()
const { queriesObject } = require('../queries')

// INDEX ROUTE
router.get('/', queriesObject.getAllLists)

// READ ROUTE
router.get('/:id', queriesObject.getListById)

// CREATE ROUTE
router.post('/', queriesObject.createList)

// UPDATE ROUTE
router.put('/:id', queriesObject.updateList)

// DELETE ROUTE
router.delete('/:id', queriesObject.deleteList)

module.exports = router
