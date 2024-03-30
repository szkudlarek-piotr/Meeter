const express = require('express')
const cors = require('cors')
app = express()
app.use(cors())

const getPeople = require('./get_people.js')
const getNumberOfVisists = require('./getNumberOfVisits.js')
const getAllCliques = require('./getAllCliques.js')
const getHumanClique = require('./addCliquesToHumans.js')
const getHumanFromClique = require('./addHumansToClique.js')
const getVisitorsOfTheDay = require('./getVisitorsOfDay.js')
app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.get("/people", async (req, res) => {
    const people = await getPeople()
    res.send(JSON.stringify(people))
})

app.get('/visits', async (req, res) => {
    const arrayOfVisits = await getNumberOfVisists()
    res.send(JSON.stringify(arrayOfVisits))
})

app.get('/all_cliques', async (req, res) => {
    const arrayOfCliques = await getAllCliques()
    res.send(JSON.stringify(arrayOfCliques))
})

app.get('/get_human_cliques', async (req, res) => {
    const humanCliqueNameArr = await getHumanClique()
    res.send(JSON.stringify(humanCliqueNameArr))
})

app.get('/add_humans_to_clique', async (req, res) => {
    const cliqueNamePhotoDir = await getHumanFromClique()
    res.send(JSON.stringify(cliqueNamePhotoDir))
})

app.get('/add_photos_to_calendar', async (req, res) => {
    const daysPhotosJson = await getVisitorsOfTheDay()
    res.send(JSON.stringify(daysPhotosJson))
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})