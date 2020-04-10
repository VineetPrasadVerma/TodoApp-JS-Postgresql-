const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

const port = 3000

app.get('/', (req, res) => {
  res.send('I am homepage')
})

app.get('/lists', db.queriesObject.getAllLists)
app.get('/lists/:id', db.queriesObject.getListById)
app.post('/lists', db.queriesObject.createList)
app.put('/lists/:id', db.queriesObject.updateList)
app.delete('/lists/:id', db.queriesObject.deleteList)

app.get('/lists/:id/tasks', db.queriesObject.getAllTodos)
app.post('/lists/:id/tasks', db.queriesObject.createTodo)
app.delete('/lists/:id/tasks/:taskId', db.queriesObject.deleteTask)

app.listen(port, () => console.log(`App listening on port ${port}`))
