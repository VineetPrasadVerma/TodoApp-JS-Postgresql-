require('dotenv').config()

const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const listRoutes = require('./routes/lists')
const taskRoutes = require('./routes/tasks')

const app = express()

// app.set('views', path.join(__dirname, '/views'))
// app.engine('html', engines.mustache)
// app.set('view engine', 'html')

// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// )

// gives the functionality of bodyParser
app.use(express.json())

// to server static file
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())

// app.get('/', (req, res) => {
//   res.render('index.html')
// })

app.use('/lists', listRoutes)
app.use('/lists/:id/tasks', taskRoutes)

app.listen(process.env.APP_PORT, () => console.log('Todo server has started'))
