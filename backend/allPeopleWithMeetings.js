var mysql      = require('mysql2');
const datetime = require('date-and-time')
var dotenv = require('dotenv');
const path = require('path')
const fs = require('fs')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getVisitsAndMettings() {
    let returnedArray = []
    const cliquesPhotosDir = path.join(__dirname, "cliques_photos")
    const humanPhotosDir = path.join(__dirname, "photos")
    const [databaseArray] = await pool.query(`SELECT pp.ID, pp.name, pp.surname, COALESCE(vg_visits.visits_count, 0) AS visits_count, COUNT(DISTINCT mh.human_id) + COUNT(DISTINCT ec.human_id) AS other_meetings, nk.known_from AS clique_name FROM party_people pp LEFT JOIN event_companion ec ON pp.ID = ec.human_id LEFT JOIN (SELECT guest_id, COUNT(*) AS visits_count FROM visit_guest GROUP BY guest_id) AS vg_visits ON pp.ID = vg_visits.guest_id LEFT JOIN meeting_human mh ON pp.ID = mh.human_id LEFT JOIN nazwy_klik nk ON pp.klika_id = nk.id GROUP BY pp.ID ORDER BY visits_count DESC, other_meetings DESC, pp.surname, pp.name;`)
    for (person of databaseArray) {
        let cliquePhoto = ""
        let humanPhoto = path.join(humanPhotosDir, "anonymous.jpg")
        console.log(path.join(cliquesPhotosDir, `${person.clique_name}.jpg`))
        if (fs.existsSync(path.join(cliquesPhotosDir, `${person.clique_name}.jpg`))) {
            cliquePhoto = path.join(cliquesPhotosDir, `${person.clique_name}.jpg`)
        }
        if (fs.existsSync(path.join(cliquesPhotosDir, `${person.clique_name}.png`))) {
            cliquePhoto = path.join(cliquesPhotosDir, `${person.clique_name}.png`)
        }
        if (fs.existsSync(path.join(humanPhotosDir, `${person.ID}.jpg`))) {
            humanPhoto = path.join(humanPhotosDir, `${person.ID}.jpg`)
        }
        let jsonToAdd = {"nameAndSurname": `${person.name} ${person.surname}`, "photoPath": `${humanPhoto}`, "visitCount": person.visits_count, "otherMeetings":person.other_meetings, "clique": person.clique_name, "cliquePhoto": `${cliquePhoto}`}
        if (person.ID != 30 && person.ID != 77) {
            returnedArray.push(jsonToAdd)
        }
    }
    return returnedArray
}
module.exports = getVisitsAndMettings