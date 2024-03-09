const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
app.use(cors())
app.use(express.json())

var get_people = require('./get_people.js')

app.get('/people', (req, res) => {
    res.send(get_people())
    let tabela = res.body
})

app.listen(port, () => {
    console.log(`Słucham na porcie ${port}.`)
})