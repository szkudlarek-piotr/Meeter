var mysql      = require('mysql2');
var dotenv = require('dotenv');
const photoDirFromId = require('./getPhotoDirFromHumanId.js');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getEventsDetails(humanId) {
    const eventsReqText = `
    SELECT CONCAT(party_people.name, " ", party_people.surname) AS human_name, events.nameOfEvent as nameOfEvent, ADDDATE(events.dateStart, INTERVAL 12 HOUR) as eventStartDate, ADDDATE(events.dateStop, INTERVAL 12 HOUR) as eventStoptDate, events.place as place, events.description as description
    FROM event_companion
    JOIN events ON events.id = event_companion.event_id
    JOIN party_people ON party_people.ID = event_companion.human_id
    WHERE event_companion.human_id = ?
    `
    const [eventsReq] = await pool.query(eventsReqText, [humanId])
    try {
        let returnedJson = {"humanName": eventsReq[0]["human_name"], "humanPhoto": photoDirFromId(humanId), "events": []}
        for (eventFromDatabase of eventsReq) {
            let objectToAdd = {"eventName": eventFromDatabase.nameOfEvent ,"dateStart": eventFromDatabase.eventStartDate, "dateStop": eventFromDatabase.eventStoptDate, "place": eventFromDatabase.place, "description": eventFromDatabase.description}
            returnedJson["events"].push(objectToAdd)
        }
        console.log(returnedJson)
        return returnedJson
    }
    catch {
        const [noEventsReq] = await pool.query(`SELECT CONCAT(name, " ", surname) as human_name FROM party_people WHERE ID = ?`, [humanId])
        returnedJson = {"humanPhoto": photoDirFromId(humanId), "humanName": noEventsReq[0].human_name, "events": []}
        console.log(returnedJson)
        return returnedJson
    }
}
module.exports = getEventsDetails