const express = require('express')
const db = require('./queries')
const app = express()

const port = 3000

app.get('/', (req, res) => {
  res.send('I am homepage')
})

app.get('/getAllLists', db.getAllLists)

app.listen(port, () => console.log(`App listening on port ${port}`))
