var mysql      = require('mysql2');
const path = require('path')
const date = require('date-and-time')
const fs = require('fs')
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getAllMeetings() {
    let jsonOfDays = {}
    let [ dataFromDatabase ] = await pool.query("SELECT meetings.meeting_date, meetings.title_after_hover, meeting_human.human_id, party_people.name, party_people.surname FROM meeting_human JOIN meetings ON meetings.ID = meeting_human.meeting_id JOIN party_people ON meeting_human.human_id = party_people.id")
    //I am adding hours to a date due to timezone issues
    for (meeting of dataFromDatabase) {
        const oldTime = meeting["meeting_date"]
        const oldTimeFormated = new Date(oldTime)
        const newTime = date.addHours(oldTimeFormated, 13)
        let photoDir = path.join(__dirname, "photos", meeting.human_id + ".jpg")
        if (!fs.existsSync(photoDir)) {
            photoDir = path.join(__dirname, "photos", "anonymous.jpg")
        }
        
        if (!jsonOfDays.hasOwnProperty(newTime)) {
            jsonOfDays[newTime] = {"names": [`${meeting.name} ${meeting.surname}`], "photos": [`${photoDir}`]}
            jsonOfDays[newTime]["title_after_hover"] = meeting.title_after_hover
        }
        else {
            jsonOfDays[newTime]["names"].push(`${meeting.name} ${meeting.surname}`)
            jsonOfDays[newTime]["photos"].push(`${photoDir}`)
        }
    }
    return jsonOfDays
}
module.exports = getAllMeetings