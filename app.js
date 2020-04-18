const express = require('express')
const bodyParser = require('body-parser')
// const cors = require('cors')
const path = require('path')
const db = require('./queries')
const app = express()

// app.set('views', path.join(__dirname, '/views'))
// app.engine('html', engines.mustache)
// app.set('view engine', 'html')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// to server static file
app.use(express.static(path.join(__dirname, 'public')))

// app.use(cors())

app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/lists', db.queriesObject.getAllLists)
app.get('/lists/:id', db.queriesObject.getListById)
app.post('/lists', db.queriesObject.createList)
app.put('/lists/:id', db.queriesObject.updateList)
app.delete('/lists/:id', db.queriesObject.deleteList)

app.get('/lists/:id/tasks', db.queriesObject.getOrderedTask)
app.post('/lists/:id/tasks', db.queriesObject.createTask)
app.put('/lists/:id/tasks/:taskId', db.queriesObject.updateTask)
app.delete('/lists/:id/tasks/:taskId', db.queriesObject.deleteTask)
app.delete('/lists/:id/tasks/', db.queriesObject.deleteCompletedTasks)

app.listen(process.env.APP_PORT, () => console.log('Todo server has started'))
