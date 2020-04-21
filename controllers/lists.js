require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const listQueries = {}

listQueries.getAllLists = async (req, res) => {
  try {
    const result = await pool.query('SELECT * from lists ORDER BY list_id')

    // const temp = await pool.query('SELECT list_name from lists')
    // console.log(temp.rows.map(l => l.list_name).filter(l => l.includes('B')))
    // console.log(result)
    if (result.rowCount === 0) return res.status(200).json({ rowCount: result.rowCount, message: 'No lists present' })
    // console.log(result)
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    // console.log('query')
    res.status(500).json({ rowCount: 0, message: 'Can\'t get lists' })
  }
}

listQueries.getListById = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json({ message: `Can't get list of ${req.params.id} id` })
  }
}

listQueries.createList = async (req, res) => {
  try {
    const listName = req.body.listName
    const result = await pool.query('INSERT INTO LISTS (list_name) VALUES ($1) RETURNING *', [listName])
    // console.log(result)
    res.status(201).json(result.rows)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add list' })
  }
}

listQueries.updateList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listName = req.body.listName
    const result = await pool.query('UPDATE LISTS SET list_name = $1 WHERE list_id = $2', [listName, listId])
    // console.log(result)
    if (result.rowCount === 0) return res.status(404).json({ message: `can't find list with id ${listId}` })
    res.status(200).json({ message: `List modified with ID: ${listId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't update list of ${req.params.id} id` })
  }
}

listQueries.deleteList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('DELETE FROM lists WHERE list_id =  $1', [listId])

    if (result.rowCount === 0) return res.status(404).json({ message: `can't find list with id ${listId}` })
    res.status(200).json({ message: `List deleted with ID: ${listId}` })
  } catch (e) {
    // console.log(e)
    res.status(500).json({ message: `Can't delete list of ${req.params.id} id` })
  }
}

module.exports = { listQueries }
