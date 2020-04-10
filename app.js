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

app.get('/getAllLists', db.queriesObject.getAllLists)
app.get('/getListById/:id', db.queriesObject.getListById)
app.post('/createList', db.queriesObject.createList)
app.put('/getListById/:id', db.queriesObject.updateList)
app.delete('/getListById/:id', db.queriesObject.deleteList )

app.listen(port, () => console.log(`App listening on port ${port}`))
