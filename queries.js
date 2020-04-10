require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const queriesObject = {}

queriesObject.getAllLists = async (req, res) => {
  try {
    const result = await pool.query('SELECT * from lists ORDER BY list_id')
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

queriesObject.getListById = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

queriesObject.createList = async (req, res) => {
  try {
    const listName = req.body.listName
    const result = await pool.query('INSERT INTO LISTS (list_name) VALUES ($1) RETURNING list_id', [listName])
    // console.log(result)
    res.status(201).send(`List added with Id ${result.rows[0].list_id} `)
  } catch (e) {
    res.status(500).json(e)
  }
}

queriesObject.updateList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listName = req.body.listName
    const result = await pool.query('UPDATE LISTS SET list_name = $1 WHERE list_id = $2', [listName, listId])
    // console.log(result)
    res.status(200).send(`List modified with ID: ${listId}`)
  } catch (e) {
    res.status(500).json(e)
  }
}

queriesObject.deleteList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('DELETE FROM lists WHERE list_id =  $1', [listId])
    res.status(200).send(`User deleted with ID: ${listId}`)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

queriesObject.getAllTodos = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('SELECT * FROM tasks WHERE list_id = $1', [listId])
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

queriesObject.createTodo = async (req, res) => {
  try {
    const listId = req.params.id
    const taskName = req.body.taskName
    const result = await pool.query('INSERT INTO TASKS (task_name, list_id) VALUES ($1, $2) RETURNING task_id', [taskName, listId])
    console.log(result)
    res.status(201).send(`Task added with Id ${result.rows[0].task_id} `)
  } catch (e) {
    res.status(500).json(e)
  }
}

// queriesObject.updateTask = async (req, res) => {
//   try {
//     const listId = Number(req.params.id)
//     const listName = req.body.listName
//     const result = await pool.query('UPDATE LISTS SET list_name = $1 WHERE list_id = $2', [listName, listId])
//     // console.log(result)
//     res.status(200).send(`List modified with ID: ${listId}`)
//   } catch (e) {
//     res.status(500).json(e)
//   }
// }

queriesObject.deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await pool.query('DELETE FROM tasks WHERE task_id =  $1', [taskId])
    res.status(200).send(`User deleted with ID: ${taskId}`)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

module.exports = { queriesObject }
