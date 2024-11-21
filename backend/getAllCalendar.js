var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
const fs = require('fs')
const moment = require('moment');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // losowy indeks od 0 do i
        [array[i], array[j]] = [array[j], array[i]]; // zamiana elementów miejscami
    }
    return array;
}

async function wholeCalendar(){
    let daysJson = {}
    let weddingsQueryText = `SELECT id, ADDDATE(weddings.date, INTERVAL 12 HOUR) AS wed_date, man_id, woman_id, partner_id, info_after_hover AS info FROM weddings`
    const [weddingsQuery] = await pool.query(weddingsQueryText)
    for (record of weddingsQuery) {
        let wedDate = record.wed_date
        const manId = record.man_id
        const manPhotoPath = path.join(__dirname, "photos", manId + ".jpg") 
        const womanId = record.woman_id
        const womanPhotoPath = path.join(__dirname, "photos", womanId + ".jpg") 
        const weddingId = record.id
        const partnerId = record.partner_id
        const afterHover = record.info
        let partnerPhotoPath = ""
        if (partnerId != null) {
            partnerPhotoPath = path.join(__dirname, "photos", partnerId + ".jpg") 
        }
        else {
            partnerPhotoPath = null
        }
        daysJson[wedDate] = {"class": "wedding" ,"man": manPhotoPath, "woman": womanPhotoPath, "wedding_id": weddingId, "partnerPhoto": partnerPhotoPath, "info": afterHover}
    }


    const visitsQueryText = `SELECT visits.visit_id as visit_id, CONCAT(party_people.name, " ", party_people.surname) AS human_name, CONCAT(visit_guest.guest_id, ".jpg") AS photo_name, ADDDATE(visits.visit_date, INTERVAL 10 HOUR) as visit_date, visits.visit_duration as duration, visits.title_afte_hover as on_hover 
    FROM visit_guest
    JOIN party_people ON party_people.id = guest_id
    JOIN visits ON visits.visit_id = visit_guest.visit_id`
    const [visitsQuery] = await pool.query(visitsQueryText)
    for (record of visitsQuery) {
        const startAsMoment = moment(record["visit_date"])
        const onHover = record["on_hover"]
        const endAsMoment = startAsMoment.add(record["duration"], "days")
        for (let day = moment(record["visit_date"]); day.isBefore(endAsMoment); day.add(1, "days")) {
            if (day in daysJson) {
                daysJson[day]["photos"].push(path.join(__dirname, "photos", record["photo_name"]))
            }
            else {
                daysJson[day] = {"photos": [path.join(__dirname, "photos", record["photo_name"])], "class": "visit", "visit_id": record.visit_id, "info": onHover}
            }
        }

       
    }
    const citybrakesQueryText = `SELECT citybreaks.ID as citybreakId, ADDDATE(citybreaks.Date_start, INTERVAL 10 HOUR) as start_date, ADDDATE(citybreaks.Date_stop, INTERVAL 10 HOUR) as stop_date, citybreaks.Place FROM citybreaks;`
    const [citybrakesReq] = await pool.query(citybrakesQueryText)
    for (record of citybrakesReq) {
        const startDate = record.start_date
        const stopDate = record.stop_date
        const citybreakId = record.citybreakId.toString()
        const tripPotosFolderPath = path.join(__dirname, "trips", citybreakId)
        const listOfTripPhotosNames = fs.readdirSync(tripPotosFolderPath)
        let listOfTripPhotosPaths = []
        for (photoName of listOfTripPhotosNames) {
            listOfTripPhotosPaths.push(path.join(__dirname, "trips", citybreakId, photoName))
        }
        for (let checkedDay = moment(startDate); checkedDay.diff(stopDate, 'days') <= 0; checkedDay.add(1, 'days')) {
            const shuffledPhotosArr = shuffleArray(listOfTripPhotosPaths)
            daysJson[checkedDay.toDate()]  = {"info": record.Place, "class": "citybreak", "citybreakId": citybreakId, "photos": shuffledPhotosArr}
        }
    }
    const meetingsText = `SELECT ADDDATE(meetings.meeting_date, INTERVAL 10 HOUR) AS meeting_date, meetings.ID as meeting_id, meetings.title_after_hover AS meeting_desc, CONCAT(meeting_human.human_id, ".jpg") as human_photo FROM meeting_human JOIN meetings ON meetings.ID = meeting_human.meeting_id`
    const [meetingReq] = await pool.query(meetingsText)
    for (record of meetingReq) {
        const meetingDate = record.meeting_date
        const meetingId = record.meeting_id
        const onhover = record.meeting_desc
        let photo_to_add = path.join(__dirname, "photos", record.human_photo)
        if (!(fs.existsSync(photo_to_add))) {
            photo_to_add = path.join(__dirname, "photos", "anonymous.jpg")
        }
        if (!(meetingDate in daysJson)) {
            daysJson[meetingDate] = {"photos": [photo_to_add], "class": "meeting", "meetingId": meetingId, "info": onhover}
        }
        else {
            if (daysJson[meetingDate]["class"] === "meeting") {
                daysJson[meetingDate]["photos"].push(photo_to_add)
            }
        }
    }
    const eventQueryText = `SELECT events.id as event_id, ADDDATE(events.meComingDate, interval 10 HOUR) as coming_date, ADDDATE(events.meLeavingDate, INTERVAL 10 HOUR) as leaving_date, CONCAT(events.nameOfEvent, " w miejscu ", events.place) as hover_description, events.Generic_photo as generic_photo, CONCAT(event_companion.human_id, ".jpg") as human_photo_name FROM events LEFT JOIN event_companion ON event_companion.event_id = events.id`
    const [eventsReq] = await pool.query(eventQueryText)
    for (record of eventsReq) {
        const startDate = record.coming_date
        const stopDate = record.leaving_date
        const eventId = record.event_id
        const textOnHover = record.hover_description
        let humanPhotoName = record.human_photo_name
        let description_to_add = textOnHover[0].toLowerCase() + textOnHover.slice(1)
        let humanPhotoPath = ""
        if (humanPhotoName != null) {
            if (fs.existsSync(path.join(__dirname, "photos", humanPhotoName))) {
                humanPhotoPath = path.join(__dirname, "photos", humanPhotoName)
            }
            else {
                humanPhotoPath = path.join(__dirname, "photos", "anonymous.jpg")
            }
        }
        if (record.human_photo != null) {
            humanPhotoPath = path.join(__dirname, "photos", record.human_photo)
        }
        let event_photo_path = ""
        if (record.generic_photo != "") {
            event_photo_path = path.join(__dirname, "events", record.generic_photo)
        }
        let potental_path_jpg = path.join(__dirname, "events", eventId + ".jpg")
        if (fs.existsSync(potental_path_jpg)) {
            event_photo_path = potental_path_jpg
        }
        let potental_path_png = path.join(__dirname, "events", eventId + ".png")
        if (fs.existsSync(potental_path_png)) {
            event_photo_path = potental_path_png
        }
        for (let checkedDay = moment(startDate); checkedDay.diff(stopDate, 'days') <= 0; checkedDay.add(1, 'days')) {
            if (!(checkedDay.toDate() in daysJson)) {
                daysJson[checkedDay.toDate()] = {"class": "event", "photos": [event_photo_path], "info": textOnHover}
                if (humanPhotoName != null) {
                    daysJson[checkedDay.toDate()]["photos"].push(humanPhotoPath)
                }
            }
            else {
                let currentTileInfo = daysJson[checkedDay.toDate()]["info"]
                if (!(currentTileInfo.includes(description_to_add)) && !(currentTileInfo.includes(textOnHover))) {
                    daysJson[checkedDay.toDate()]["info"] += ` oraz ${description_to_add}`
                }
                if (!(humanPhotoPath in daysJson[checkedDay.toDate()]["photos"]) && daysJson[checkedDay.toDate()]["class"] != "citybreak") {
                    daysJson[checkedDay.toDate()]["photos"].push(humanPhotoPath)
                }
            }
        }
    }
    return daysJson
}

module.exports = wholeCalendar