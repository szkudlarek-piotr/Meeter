var mysql = require('mysql2');
var dotenv = require('dotenv');
const path = require('path');
const { send } = require('process');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function humanDetails(humanId) {
    const requestText = `SELECT CONCAT(party_people.name, ' ', party_people.surname) AS human_name, nazwy_klik.known_from AS clique_name, party_people.lives_where AS living_in FROM party_people JOIN nazwy_klik ON party_people.klika_id = nazwy_klik.id WHERE party_people.id = ?`
    const [humanReq] = await pool.query(requestText, [humanId])
    const humanName = humanReq[0]["human_name"]
    const pathToHumanPhoto = path.join(__dirname, "photos", `${humanId}.jpg`)
    let returnedJson = {"photoDir": pathToHumanPhoto, "name": humanReq[0]["human_name"], "lives_in": humanReq[0]["living_in"], "clique_name": humanReq[0]["clique_name"]}
    const randomQuoteText = "SELECT quote FROM golden_quotes WHERE human_id = ? ORDER BY RAND() LIMIT 1;"
    const [randomQuote] = await pool.query(randomQuoteText, [humanId])
    if (randomQuote.length > 0) {
        const quoteText = randomQuote[0]["quote"]
        returnedJson["quote"] = quoteText
    }
    const meetingsWithHumanText = 
    `SELECT ADDDATE(meetings.meeting_date, INTERVAL 12 HOUR)  AS meetingDate, meetings.title_after_hover AS meeting_description
    FROM meeting_human 
    JOIN meetings ON meetings.ID = meeting_human.meeting_id 
    WHERE meeting_human.human_id = ?
    ORDER BY meetingDate DESC;`
    const [meetingsWithHumanReq] = await pool.query(meetingsWithHumanText, [humanId])
    returnedJson["meetings"] = {}
    for (meeting of meetingsWithHumanReq) {
        returnedJson["meetings"][meeting["meetingDate"]] = meeting["meeting_description"]
    }
    const visitsWithHumanText = 
    `SELECT ADDDATE(visits.visit_date, INTERVAL 12 HOUR)  AS visitDate, visits.title_afte_hover AS visit_description
    FROM visit_guest 
    JOIN visits ON visits.visit_id = visit_guest.visit_id 
    WHERE visit_guest.guest_id = ?
    ORDER BY visitDate DESC;`
    const [visitReq] = await pool.query(visitsWithHumanText, [humanId])
    returnedJson["visits"] = {}
    for (visit of visitReq) {
        returnedJson["visits"][visit["visitDate"]] = visit["visit_description"]
    }
    const eventsWithHumanText = 
    `SELECT ADDDATE(events.meComingDate, INTERVAL 12 HOUR) AS eventMeComing, ADDDATE(events.meLeavingDate, INTERVAL 12 HOUR) AS eventLeavingDate, events.nameOfEvent AS eventName, events.description
    FROM event_companion
    JOIN events ON events.id = event_companion.event_id
    WHERE event_companion.human_id = ?
    ORDER BY eventMeComing DESC;`
    const [eventsReq] = await pool.query(eventsWithHumanText, [humanId])
    returnedJson["events"] = {}
    for (dbEvent of eventsReq) {
        returnedJson["events"][dbEvent["eventMeComing"]] = dbEvent["eventName"]
    }
    return returnedJson
}
module.exports = humanDetails