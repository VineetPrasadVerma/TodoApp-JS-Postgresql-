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
    if (result.rowCount === 0) return res.status(200).json({ message: 'No lists present' })
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json({ message: 'Can\'t get lists' })
  }
}

queriesObject.getListById = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    res.status(200).json(result.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json({ message: `Can't get list of ${req.params.id} id` })
  }
}

queriesObject.createList = async (req, res) => {
  try {
    const listName = req.body.listName
    const result = await pool.query('INSERT INTO LISTS (list_name) VALUES ($1) RETURNING list_id', [listName])
    // console.log(result)
    res.status(201).send(`List added with Id ${result.rows[0].list_id} `)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add list' })
  }
}

queriesObject.updateList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listName = req.body.listName
    const result = await pool.query('UPDATE LISTS SET list_name = $1 WHERE list_id = $2', [listName, listId])
    // console.log(result)
    if (result.rowCount === 0) return res.status(404).json({ message: `can't find list with id ${listId}` })
    res.status(200).send(`List modified with ID: ${listId}`)
  } catch (e) {
    res.status(500).json({ message: `Can't update list of ${req.params.id} id` })
  }
}

queriesObject.deleteList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const result = await pool.query('DELETE FROM lists WHERE list_id =  $1', [listId])

    if (result.rowCount === 0) return res.status(404).json({ message: `can't find list with id ${listId}` })
    res.status(200).send(`List deleted with ID: ${listId}`)
  } catch (e) {
    // console.log(e)
    res.status(500).json({ message: `Can't delete list of ${req.params.id} id` })
  }
}

queriesObject.getAllTodos = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listResult = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    if (listResult.rowCount === 0) return res.status(404).json({ message: 'List doesn\'t exist' })

    const taskResult = await pool.query('SELECT * FROM tasks WHERE list_id = $1', [listId])

    if (taskResult.rowCount === 0) return res.status(200).json({ message: 'No task present' })
    res.status(200).json(taskResult.rows)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t get tasks' })
  }
}

queriesObject.createTodo = async (req, res) => {
  try {
    const listId = req.params.id
    const taskName = req.body.taskName

    const listResult = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    if (listResult.rowCount === 0) return res.status(404).json({ message: 'List doesn\'t exist' })

    const result = await pool.query('INSERT INTO TASKS (task_name, list_id) VALUES ($1, $2) RETURNING task_id', [taskName, listId])

    res.status(201).send(`Task added with Id ${result.rows[0].task_id} `)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add task' })
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
    const listId = Number(req.params.id)

    const result = await pool.query('DELETE FROM tasks WHERE task_id =  $1 AND list_id = $2', [taskId, listId])
    if (result.rowCount === 0) return res.status(404).json({ message: `can't find task with id ${taskId}` })

    res.status(200).send(`Task deleted with ID: ${taskId}`)
  } catch (e) {
    res.status(500).json({ message: `Can't delete task of id ${req.params.taskId}` })
  }
}

module.exports = { queriesObject }
