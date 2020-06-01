const { pool } = require('../config')

const taskQueries = {}

taskQueries.getAllTasks = async (req, res) => {
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

taskQueries.createTask = async (req, res) => {
  try {
    const listId = req.params.id
    const taskName = req.body.taskName

    const listResult = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    if (listResult.rowCount === 0) return res.status(404).json({ message: 'List doesn\'t exist' })

    const result = await pool.query('INSERT INTO TASKS (task_name, list_id) VALUES ($1, $2) RETURNING *', [taskName, listId])

    res.status(201).send(result.rows)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add task' })
  }
}

taskQueries.updateTask = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const taskId = Number(req.params.taskId)

    const requestBody = req.body
    const taskField = Object.keys(requestBody)[0]
    const taskValue = requestBody[taskField]

    const listResult = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    if (listResult.rowCount === 0) return res.status(404).json({ message: 'List doesn\'t exist' })

    const result = await pool.query(`UPDATE TASKS SET ${taskField} = '${taskValue}' WHERE task_id = ${taskId} and list_id = ${listId}`)

    if (result.rowCount === 0) return res.status(404).json({ message: `can't find task with id ${taskId}` })
    res.status(200).send({ message: `Task modified with ID: ${taskId}` })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: `Can't update task of ${req.params.id} id` })
  }
}

taskQueries.getOrderedTask = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listResult = await pool.query('SELECT * FROM lists WHERE list_id =  $1', [listId])
    if (listResult.rowCount === 0) return res.status(404).json({ message: 'List doesn\'t exist' })

    // const taskResult = await pool.query(`SELECT * FROM (SELECT * FROM
    //     (SELECT * FROM (SELECT * FROM tasks WHERE list_id = ${listId} ORDER BY task_id)
    //       AS or_taskid ORDER BY scheduled)
    //         AS or_scheduled ORDER BY priority DESC)
    //           AS or_priority ORDER BY completed;`)

    const taskResult = await pool.query(`SELECT * FROM tasks where list_id = ${listId} ORDER BY completed, priority DESC, scheduled, task_id;`)

    if (taskResult.rowCount === 0) return res.status(200).json({ rowCount: taskResult.rowCount, message: 'No task present' })
    res.status(200).json(taskResult.rows)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t get tasks' })
  }
}

taskQueries.deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId)
    const listId = Number(req.params.id)

    const result = await pool.query('DELETE FROM tasks WHERE task_id =  $1 AND list_id = $2', [taskId, listId])
    if (result.rowCount === 0) return res.status(404).json({ message: `can't find task with id ${taskId}` })

    res.status(200).send({ message: `Task deleted with ID: ${taskId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't delete task of id ${req.params.taskId}` })
  }
}

taskQueries.deleteCompletedTasks = async (req, res) => {
  try {
    // const taskId = Number(req.params.taskId)
    const listId = Number(req.params.id)

    const result = await pool.query('DELETE FROM tasks WHERE completed = true and list_id = $1', [listId])
    if (result.rowCount === 0) return res.status(404).json({ message: 'Don\'t have any completed task' })

    res.status(200).send({ message: 'Tasks Deleted' })
  } catch (e) {
    res.status(500).json({ message: 'Can\'t delete tasks ' })
  }
}

module.exports = { taskQueries }
