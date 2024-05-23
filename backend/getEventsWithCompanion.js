var mysql = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const datetime = require('date-and-time');
const { json } = require('express');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getEventsWithCompanion() {
    let jsonOfDates = {}
    const eventsPhotosDir = path.join(__dirname, "events")
    const requestText = `
    SELECT ADDDATE(events.dateStart, INTERVAL 12 HOUR) as startDate, 
    ADDDATE(events.dateStop, INTERVAL 12 HOUR) as stopDate, 
    event_companion.human_id as personID,events.id as eventId, events.Generic_photo, 
    CONCAT(party_people.name, " ", party_people.surname) AS nameAndSurname, 
    events.nameOfEvent AS eventName 
    FROM events 
    LEFT JOIN event_companion ON events.id = event_companion.event_id 
    LEFT JOIN party_people ON party_people.ID = event_companion.human_id;`
    const allEventsResult = await pool.query(requestText)
    const eventsArr = allEventsResult[0]
    
    for (eventFromDb of eventsArr) {
        //console.log(eventFromDb)
        let photoDir = ""
        const startDateOfEvent = eventFromDb.startDate
        const stopDateOfEvent = eventFromDb.stopDate
        const eventTitle = eventFromDb.eventName
        if (eventFromDb.Generic_photo != null) {
            photoDir = path.join(eventsPhotosDir, eventFromDb.Generic_photo)
        }
        if (fs.existsSync(path.join(eventsPhotosDir, `${eventFromDb.eventId}.jpg`))) {
            photoDir = path.join(eventsPhotosDir, `${eventFromDb.eventId}.jpg`)
        }
        if (fs.existsSync(path.join(eventsPhotosDir, `${eventFromDb.eventId}.png`))) {
            photoDir = path.join(eventsPhotosDir, `${eventFromDb.eventId}.png`)
        }

        if (jsonOfDates.hasOwnProperty(startDateOfEvent)) {
            let touchedDay = jsonOfDates[startDateOfEvent]
            if (eventFromDb.personID != null) {
                const addedPhotoDir = path.join(__dirname, "photos", `${eventFromDb.personID}.jpg`)
                if (!touchedDay["allPhotos"].includes(path.join(__dirname, "photos", `${eventFromDb.personID}.jpg`))) {
                    
                }
                touchedDay["allPhotos"].push(path.join(__dirname, "photos", `${eventFromDb.personID}.jpg`))
            }
        }
        if (!jsonOfDates.hasOwnProperty(startDateOfEvent)) {
            jsonOfDates[startDateOfEvent] = {"title": eventTitle, "allPhotos": [photoDir]}
            if (eventFromDb.personID != null) {
                const photoOfAddedPerson = path.join(__dirname, "photos", `${eventFromDb.personID}.jpg`)
                jsonOfDates[startDateOfEvent]["allPhotos"].push(photoOfAddedPerson)
            }
        }
    }
    for (eventFromDb of eventsArr) {
        console.log(eventFromDb)
        const startDateOfEvent = eventFromDb.startDate
        const stopDateOfEvent = eventFromDb.stopDate
        const detailsOfStartDay = jsonOfDates[startDateOfEvent]
        const dayAfterStart = datetime.addDays(startDateOfEvent, 1)
        let checkedDay = dayAfterStart
        if (startDateOfEvent != stopDateOfEvent) {
            console.log(`Sprawdzam teraz ${checkedDay}`)
            while (checkedDay <= stopDateOfEvent) {
                if (!jsonOfDates.hasOwnProperty(checkedDay)) {
                    jsonOfDates[checkedDay] = detailsOfStartDay
                }
                checkedDay = datetime.addDays(checkedDay, 1)
        }
    }
    console.log(jsonOfDates)
    for (eventFromDb of eventsArr) {
        const startDateOfEvent = eventFromDb.startDate
        const stopDateOfEvent = eventFromDb.stopDate
        if (startDateOfEvent != stopDateOfEvent) {
            const dayAfterStart = datetime.addDays(startDateOfEvent, 1)
            let checkedDay = dayAfterStart
            while (checkedDay <= stopDateOfEvent) {
                jsonOfDates[checkedDay] = jsonOfDates[startDateOfEvent]
                checkedDay = datetime.addDays(checkedDay, 1)
            }
        }
    }

    return [jsonOfDates]
    }
}
module.exports = getEventsWithCompanion