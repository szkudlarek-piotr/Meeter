const express = require('express')
const cors = require('cors')
app = express()
app.use(cors())

const getPeople = require('./get_people.js')
var multer = require('multer')
var upload = multer({ dest: 'photos/'})
const addGuestToVisit = require('./addGuestToVisit.js')
const addVisit = require('./addVisit.js')
const getVisitId = require('./getVisitId.js')
const getLeftMenu = require('./sendLeftMenu.js')
const getAllMeetingsDates = require('./getAllMeetingsDates.js')
const getNumberOfVisists = require('./getNumberOfVisits.js')
const getAllCliques = require('./getAllCliques.js')
const peopleFromString = require('./selectPeopleFromSubstring.js')
const getHumanClique = require('./addCliquesToHumans.js')
const getHumanFromClique = require('./addHumansToClique.js')
const getVisitorsSecond = require('./getVisitorsOfDay2.js')
const getAllWeddings = require('./getAllWeddings.js')
const getSuggestedCliques = require('./getSuggestestedCliques.js')
const getMeetings = require('./getAllMeetings.js')
const addHuman = require('./addHuman.js')
const meetingsNumber = require('./getNumberOfMeetings.js')
const getEvents = require('./getEvents.js')
const addMeeting = require('./addMeeting.js')
const getIdFromIdentifiers = require('./getIdFromIdentifiers.js')
const getMeetingId = require('./getMeetingId.js')
const addPersonToMeeting = require('./addPersonToMeting.js')
const uploadHumanPhoto = require('./uploadHumanPhoto.js')
app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.get("/people", async (req, res) => {
    const people = await getPeople()
    res.send(JSON.stringify(people))
})

app.get("/meetings-number", async (req, res) => {
    const numbersOfMeetings = await meetingsNumber()
    res.send(JSON.stringify(numbersOfMeetings))
})

app.get('/visits', async (req, res) => {
    const arrayOfVisits = await getNumberOfVisists()
    res.send(JSON.stringify(arrayOfVisits))
})
app.get('/events', async (req, res) => {
    const eventsJson = await getEvents()
    res.send(JSON.stringify(eventsJson))
})

app.get('/get_visit_id', async (req, res) => {
    const date = req.query.date
    const duration = req.query.duration
    const description = req.query.description
    const obtainedId = await getVisitId(date, duration, description)
    res.send(obtainedId)
})

app.get('/weddings', async (req, res) =>{
    const arrayOfWeddings = await getAllWeddings()
    res.send(JSON.stringify(arrayOfWeddings))
})

app.get('/left_menu', async (req, res) => {
    const jsonOfButtons = await getLeftMenu()
    res.send(JSON.stringify(jsonOfButtons))
})

app.get('/all_meetings_dates', async (req, res) => {
    const allDates = await getAllMeetingsDates()
    res.send(allDates)
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

app.get('/add_visits_to_calendar', async (req, res) => {
    const daysVisitsJson = await getVisitorsSecond()
    res.send(JSON.stringify(daysVisitsJson))
})
app.post('/add_guest_to_visit', async (req, res) => {
    const idOfGuest = req.query.guest_id
    const idOfVisit = req.query.visit_id
    try {
    await addGuestToVisit(idOfVisit, idOfGuest)
        res.status(200).send("Guest added succesfully.")
    }
    catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW') {
            res.status(400).send("Visit with a given ID was not found.")
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).send("Guest with a given ID was not found.")
        }
        else {
            console.error(error)
            res.status(50).send("Internal server error.")
        }
    }
    
})
app.post('/add_human_to_meeting', async (req, res) => {
    const meeting = req.query.meeting
    const human = req.query.human
    try {
        await addPersonToMeeting(meeting, human)
        res.status(200).send("Human was succesfully added to a meeting")
    }
    catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW') {
            res.status(400).send("Meeting with a given ID was not found.")
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).send("Human with a given ID was not found.")
        }
        else {
            console.error(error)
            res.status(500).send("Internal server error.")
        }
    }
    
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
    const description = req.query.description
    res.send(`Otrzymałem dane o spotkaniu w dniu ${dateOfMeeting} w ${placeOfMeeting}.`)
    await addMeeting(placeOfMeeting, dateOfMeeting, description)
})
app.get('/meeting_id_from_date', async (req, res) => {
    const dateToSend = req.query.date
    const idInTable = await getMeetingId(dateToSend)
    res.send(idInTable)
})
app.post ('/upload_human_photo', upload.single('photo'), (req, res) => {
    const file = req.file
    console.log(file)
    const description = req.body.description
    res.send("OK")
})
app.post('/add_human', async (req, res) => {
    const nameToSave = req.query.name
    const surnameToSave = req.query.surname
    const genderToSave = req.query.gender
    const cliqueToSave = req.query.clique
    const fbToSave = req.query.fb
    const cityToSave = req.query.city
    try {
    const serverResonse = await addHuman(nameToSave,surnameToSave,genderToSave,fbToSave,cityToSave,cliqueToSave)
    res.send(serverResonse)
    }
    catch (error) {
        if (error.code == "ER_NO_REFERENCED_ROW_2") {
            res.status(400).send("Clique with a given ID was not found.")
        }
        else {
            console.error(error)
            res.status(500).send("Internal server error.")
        }
        
    }

})

app.post('/add_visit', async (req,res) => {
    const date = req.query.date
    const duration = req.query.duration
    const description = req.query.description
    const postRequest = addVisit(date, duration, description)
    //res.send(postRequest.status)
    res.send(postRequest)
})
app.get('/get_visit_id', async (res, req) => {
    const date = req.query.date
    const duration = req.query.duration
    const description = req.query.description
    const getVIsitIdResponse = await getVisitId(date, duration, description)
    res.send(getVIsitIdResponse)
})
app.get('/people_from_substring', async (req, res) => {
    const deliveredString = req.query.substring
    const resultOfQuery = await peopleFromString(deliveredString)
    res.send(resultOfQuery)
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})