const express = require('express')
const cors = require('cors')
app = express()
app.use(cors())

const getPeople = require('./get_people.js')
const getLeftMenu = require('./sendLeftMenu.js')
const getNumberOfVisists = require('./getNumberOfVisits.js')
const getAllCliques = require('./getAllCliques.js')
const peopleFromString = require('./selectPeopleFromSubstring.js')
const getHumanClique = require('./addCliquesToHumans.js')
const getHumanFromClique = require('./addHumansToClique.js')
const getVisitorsOfTheDay = require('./getVisitorsOfDay.js')
const getAllWeddings = require('./getAllWeddings.js')
const getSuggestedCliques = require('./getSuggestestedCliques.js')
const getMeetings = require('./getAllMeetings.js')
const addHuman = require('./addHuman.js')
const addMeeting = require('./addMeeting.js')
const getIdFromIdentifiers = require('./getIdFromIdentifiers.js')
const getMeetingId = require('./getMeetingId.js')
const addPersonToMeeting = require('./addPersonToMeting.js')
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

app.get('/weddings', async (req, res) =>{
    const arrayOfWeddings = await getAllWeddings()
    res.send(JSON.stringify(arrayOfWeddings))
})

app.get('/left_menu', async (req, res) => {
    const jsonOfButtons = await getLeftMenu()
    res.send(JSON.stringify(jsonOfButtons))
})
app.get('/all_cliques', async (req, res) => {
    const arrayOfCliques = await getAllCliques()
    res.send(JSON.stringify(arrayOfCliques))
})
app.get('/suggested_cliques', async (req, res) => {
    const returnedCliques = await getSuggestedCliques(req.query.subs)
    res.send(JSON.stringify(returnedCliques))
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
app.post('/add_human_to_meeting', async (req, res) => {
    const meeting = req.query.meeting
    const human = req.query.human
    console.log(meeting)
    console.log(human)
    addPersonToMeeting(meeting, human)
})

app.get('/meetings', async (req, res) => {
    const allMeetings = await getMeetings()
    res.json(allMeetings)
})
app.get('/get_id', async (req, res) => {
    const nameOfHuman = req.query.name
    const surnameOfHuman = req.query.surname
    const fbOfHuman = req.query.fb_link
    const idFromDatabase = await getIdFromIdentifiers(nameOfHuman, surnameOfHuman, fbOfHuman)
    res.json(idFromDatabase)
})

app.post('/add_meeting', async (req, res) => {
    const placeOfMeeting = req.query.place
    const dateOfMeeting = req.query.date
    res.send(`Otrzymałem dane o spotkaniu w dniu ${dateOfMeeting} w ${placeOfMeeting}.`)
    await addMeeting(placeOfMeeting, dateOfMeeting)
})
app.get('/meeting_id_from_date', async (req, res) => {
    const dateToSend = req.query.date
    const idInTable = await getMeetingId(dateToSend)
    res.send(idInTable)
})

app.post('/add_human', async (req, res) => {
    const nameToSave = req.query.name
    const surnameToSave = req.query.surname
    const genderToSave = req.query.gender
    const cliqueToSave = req.query.clique
    const fbToSave = req.query.fb
    const cityToSave = req.query.city
    const serverResonse = await addHuman(nameToSave,surnameToSave,genderToSave,fbToSave,cityToSave,cliqueToSave)
    res.send(serverResonse)
})

app.get('/people_from_substring', async (req, res) => {
    const deliveredString = req.query.substring
    const resultOfQUery = await peopleFromString(deliveredString)
    res.send(resultOfQUery)
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})