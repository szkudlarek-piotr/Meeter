var mysql      = require('mysql2');

var dotenv = require('dotenv');
const photoDirFromId = require('./getPhotoDirFromHumanId.js')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getVisitsDetails(humanId) {
    const visitsDetailsReqText = `
    SELECT CONCAT(party_people.name, " ", party_people.surname) as guest_name, ADDDATE(visits.visit_date, INTERVAL 12 HOUR) as visit_date, visits.title_afte_hover as short_desc, visits.description as long_desc 
    FROM visit_guest
    JOIN visits ON visit_guest.visit_id = visits.visit_id
    JOIN party_people ON party_people.ID = visit_guest.guest_id
    WHERE visit_guest.guest_id = ?
    ORDER BY visits.visit_date
    `
    try {
        const [visitsDetailsReq] = await pool.query(visitsDetailsReqText, [humanId])
        let returnedJson = {"photo": photoDirFromId(humanId), "guestName":visitsDetailsReq[0].guest_name, visits: []}
        for (visit of visitsDetailsReq) {
            let jsonToAdd = {"date": visit.visit_date, "shortDesc": visit.short_desc, "longDesc": visit.long_desc}
            returnedJson.visits.push(jsonToAdd)
        }
        return returnedJson
    }
    catch {
        const [noVisitsreq] = await pool.query(`SELECT CONCAT(name, " ", surname) as guest_name FROM party_people WHERE ID = ?`, [humanId])

        console.log("Dla danej osoby nie odnaleziono żadnej wizyty.")
        returnedJson = {"photo": photoDirFromId(humanId), "guestName":noVisitsreq[0].guest_name, visits: []}
        return returnedJson
    }

}
module.exports = getVisitsDetails