var mysql = require('mysql2');
var dotenv = require('dotenv');
const photoFromId = require('./getPhotoDirFromHumanId')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getOftenSeenWith(human_id) {
        let humansObject = {}
        const visitsRequestText = `SELECT CONCAT(party_people.name, " ", party_people.surname) AS full_name, visit_guest.guest_id AS humanId FROM visit_guest JOIN party_people ON party_people.ID = visit_guest.guest_id WHERE visit_guest.visit_id IN (SELECT visit_guest.visit_id FROM visit_guest WHERE visit_guest.guest_id = ?) AND visit_guest.guest_id != ?`
        const [visitsRequest] = await pool.query(visitsRequestText, [human_id, human_id])
        for (human of visitsRequest) {
            if (!(humansObject.hasOwnProperty(human.humanId))) {
                humansObject[human.humanId] = {humanName: human.full_name, interactionsNumber: 1.0, photoDir: photoFromId(human.humanId)}

            }
            else {
                humansObject[human.humanId]["interactionsNumber"] += 1.0
            }
        }
        const meetingsRequestText = `SELECT  meeting_human.human_id AS humanId, CONCAT(party_people.name, " ", party_people.surname) AS full_name FROM meeting_human JOIN party_people ON party_people.ID = meeting_human.human_id WHERE meeting_human.meeting_id IN (SELECT meeting_human.meeting_id FROM meeting_human WHERE meeting_human.human_id = ?) AND  meeting_human.human_id != ?`
        const [meetingsRequest] = await pool.query(meetingsRequestText, [human_id, human_id])
        for (human of meetingsRequest) {
            if (!(humansObject.hasOwnProperty(human.humanId))) {
                humansObject[human.humanId] = {humanName: human.full_name, interactionsNumber: 1.0, photoDir: photoFromId(human.humanId)}
            }
            else {
                humansObject[human.humanId]["interactionsNumber"] += 1.0
            }
        }
        const eventsReqText = `SELECT CONCAT(party_people.name, " ", party_people.surname) AS full_name, event_companion.human_id as humanId FROM event_companion JOIN party_people ON party_people.ID = event_companion.human_id WHERE event_companion.event_id IN (SELECT event_companion.event_id FROM event_companion WHERE event_companion.human_id = ?) AND event_companion.human_id != ?`
        const [eventsReq] = await pool.query(eventsReqText, [human_id, human_id])
        for (human of eventsReq) {
            if (!(humansObject.hasOwnProperty(human.humanId))) {
                humansObject[human.humanId] = {humanName: human.full_name, interactionsNumber: 0.25, photoDir: photoFromId(human.humanId)}
            }
            else {
                humansObject[human.humanId]["interactionsNumber"] += 0.25
            }
        }
    const marriageReqText = `SELECT weddings.woman_id AS humanId, CONCAT(party_people.name, " ", party_people.surname) AS full_name FROM weddings JOIN party_people ON party_people.ID = weddings.woman_id WHERE weddings.man_id = ? UNION SELECT weddings.man_id AS humanId, CONCAT(party_people.name, " ", party_people.surname) AS full_name FROM weddings JOIN party_people ON party_people.ID = weddings.man_id WHERE weddings.woman_id = ?`
    const [marriageReq] = await pool.query(marriageReqText, [human_id, human_id])
    for (human of marriageReq) {
        if (!(humansObject.hasOwnProperty(human.humanId))) {
            humansObject[human.humanId] = {humanName: human.full_name, interactionsNumber: 10, photoDir: photoFromId(human.humanId)}
        }
        else {
            humansObject[human.humanId]["interactionsNumber"] += 10
        }
    }
    const weddingGuestsText = `SELECT wedding_guest.guest_id as humanId, CONCAT(party_people.name, " ",party_people.surname) AS full_name FROM wedding_guest JOIN weddings ON weddings.id = wedding_guest.wedding_id JOIN party_people ON party_people.ID = wedding_guest.guest_id WHERE weddings.man_id = ? OR weddings.woman_id = ?`
    const [weddingGuestsReq] = await pool.query(weddingGuestsText, [human_id, human_id])
    for (human of weddingGuestsReq) {
        if (!(humansObject.hasOwnProperty(human.humanId))) {
            humansObject[human.humanId] = {humanName: human.full_name, interactionsNumber: 3, photoDir: photoFromId(human.humanId)}
        }
        else {
            humansObject[human.humanId]["interactionsNumber"] += 3
        }
    }
    const sortedHumansArray = Object.entries(humansObject).sort(([, a], [, b]) => b.interactionsNumber - a.interactionsNumber)
    const cuttedHumansArray = sortedHumansArray.filter((human) => human[1].interactionsNumber > 1)

    return cuttedHumansArray
}
module.exports = getOftenSeenWith