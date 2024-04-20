var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const date = require('date-and-time');
const { json } = require('express');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getDateEventsJson() {
    const askedRequest = "SELECT * FROM `events`;"
    const [ requestedData ] = await pool.query(askedRequest)
    let returnedJson = {}
    for (record of requestedData) {
        const idOfEvent = record.id
        let pathToEventPhoto = ""
        if (fs.existsSync(path.join(__dirname, "events", `${idOfEvent.toString()}.jpg`))) {
            pathToEventPhoto = path.join(__dirname, "events", `${idOfEvent.toString()}.jpg`)
        }
        if (fs.existsSync(path.join(__dirname, "events", `${idOfEvent.toString()}.png`))) {
            pathToEventPhoto = path.join(__dirname, "events", `${idOfEvent.toString()}.png`)
        }
        const startDateFromDb = record.dateStart
        const modifiedStartDate = date.addHours(startDateFromDb, 12)
        const stopDateFromDb = record.dateStop
        const modifiedStopDate = date.addHours(stopDateFromDb, 12)
        const nameOfEvent = record.nameOfEvent
        const place = record.place
        const titleAfterHover = `${record.nameOfEvent} w miejscu ${record.place}`
        const comingDateFromDb = record.meComingDate
        const modifiedComingDate = date.addHours(comingDateFromDb, 12)
        const leavingDate = record.meLeavingDate
        const modifiedLeavingDate = date.addHours(leavingDate, 12)
        returnedJson[modifiedStartDate] = {"eventPhoto": pathToEventPhoto, "name": nameOfEvent, "dateStart": modifiedStartDate, "stopDate": modifiedStopDate, "titleAfterHover": titleAfterHover, "place": place}
        if (modifiedStartDate.getDate() != modifiedStopDate.getDate()) {
            const iterationStart = date.addDays(modifiedStartDate, 1)
            const dayAfterStop = date.addDays(modifiedStopDate, 1)
            let checkedDate = iterationStart
            while (checkedDate.getDate() != dayAfterStop.getDate()) {
                returnedJson[checkedDate] = {"eventPhoto": pathToEventPhoto, "name": nameOfEvent, "dateStart": modifiedStartDate, "stopDate": modifiedStopDate, "titleAfterHover": titleAfterHover, "place": place}
                checkedDate = date.addDays(checkedDate,1)
            }
        }
    }
    return returnedJson
}
module.exports = getDateEventsJson
//getDateEventsJson()