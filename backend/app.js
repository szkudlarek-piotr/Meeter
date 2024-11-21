const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const getPeople = require('./get_people.js')
var multer = require('multer')
var upload = multer({ dest: 'photos/'})
const addGuestToVisit = require('./addGuestToVisit.js')
const addVisit = require('./addVisit.js')
const getEventsWithCompanion = require('./getEventsWithCompanion.js')
const getVisitId = require('./getVisitId.js')
const humanDetails = require('./getHumanDetails.js')
const getLeftMenu = require('./sendLeftMenu.js')
const addGoldenQuote = require('./addGoldenQuote.js')
const getAllMeetingsDates = require('./getAllMeetingsDates.js')
const getNumberOfVisists = require('./getNumberOfVisits.js')
const getAllCliques = require('./getAllCliques.js')
const fixedHumans = require('./fixedHumans.js')
const singleVisitDetails = require('./getSingleVisit.js')
const getSingleWedding = require('./getSingleWedding.js')
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
const addEvent = require('./addEvent.js')
const getNews = require('./getNews.js')
const getIdFromIdentifiers = require('./getIdFromIdentifiers.js')
const getMeetingId = require('./getMeetingId.js')
const addPersonToMeeting = require('./addPersonToMeting.js')
const weddingPartners = require('./weddingPartnerFromSubsting.js')
const uploadHumanPhoto = require('./uploadHumanPhoto.js')
const addPartnerToWedding = require('./addPartnerToWedding.js')
const wholeCalendar = require('./getAllCalendar.js')
app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.get("/people", async (req, res) => {
    const people = await getPeople()
    res.send(JSON.stringify(people))
})

app.get("/whole-calendar", async (req, res) => {
    const daysToAdd = await wholeCalendar()
    res.send(JSON.stringify(daysToAdd))
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

app.get('/visit-details', async(req, res) => {
    const visitId = req.query.visit_id
    const visitJson = await singleVisitDetails(visitId)
    res.send(JSON.stringify(visitJson))
})

app.get('/wedding-partner-search', async (req, res) => {
    const substring = req.query.subs
    const potentialPartners = await weddingPartners(substring)
    res.send(potentialPartners)
})

app.get('/get-news', async (req, res) => {
    const allNews = await getNews()
    res.send(JSON.stringify(allNews))
})

app.get('/single-wedding', async (req, res) => {
    const weddingNumber = req.query.number
    const weddingJson = await getSingleWedding(weddingNumber)
    res.send(JSON.stringify(weddingJson))
})

app.get('/events-with-companion', async (req, res) => {
    const eventsCompanionsJson = await getEventsWithCompanion()
    res.send(JSON.stringify(eventsCompanionsJson))
})
app.get('/get_visit_id', async (req, res) => {
    const date = req.query.date
    const duration = req.query.duration
    const description = req.query.description
    const obtainedId = await getVisitId(date, duration, description)
    res.send(obtainedId)
})

app.get('/people-with-meetings', async (req, res) => {
    const peopleArray = await fixedHumans()
    res.send(peopleArray)
})

app.get('/weddings', async (req, res) =>{
    const arrayOfWeddings = await getAllWeddings()
    res.send(JSON.stringify(arrayOfWeddings))
})

app.get('/left_menu', async (req, res) => {
    const jsonOfButtons = await getLeftMenu()
    res.send(JSON.stringify(jsonOfButtons))
})

app.get('/human-details', async (req, res) => {
    const humanId = req.query.id
    const humanDetailsJson = await humanDetails(humanId)
    res.send(JSON.stringify(humanDetailsJson))
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
app.patch('/wedding-partner-change', async(req, res) => {
    const weddingId = req.query.wedding
    const partnerId = req.query.partner
    const addingMessage = await addPartnerToWedding(partnerId, weddingId)
    res.send(JSON.stringify(addingMessage))
    //try {
        //
        
    //}
    //catch (error) {
        //res.send(error)
    //}
})
app.post('/save-quote', async(req, res) => {
    const authorId = req.query.author
    const quote = req.query.quote
    const public = req.query.ispublic
    try {
        const postQuoteReq = await addGoldenQuote(authorId, quote, public)
        res.status(200).send("Good")
    }
    catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).send("Nie udało się")
        }
    }
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
app.post('/add-clique', async(req, res) => {
    console.log(req)
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

app.post('/add-event', async (req, res) => {
    const eventName = req.query.eventName
    const placeName = req.query.placeName
    const eventStartDate = req.query.eventStartDate
    const eventStopDate = req.query.eventStopDate
    const comingDate = req.query.comingDate
    const leavingDate = req.query.leavingDate
    const genericPhotoName = req.query.genericPhotoName
    const addEventReq = await addEvent(eventName, placeName, eventStartDate, eventStopDate, comingDate, leavingDate, genericPhotoName)
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
    const longDescription = req.query.longdesc
    const returnedId = await addMeeting(placeOfMeeting, dateOfMeeting, description, longDescription)
    res.send(returnedId)
})
app.get('/meeting_id_from_date', async (req, res) => {
    const dateToSend = req.query.date
    const shortdesc = req.query.shortdesc
    const idInTable = await getMeetingId(dateToSend, shortdesc)
    res.send(idInTable)
})
app.post ('/upload_human_photo', upload.single('photo'), (req, res) => {
    const file = req.file
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