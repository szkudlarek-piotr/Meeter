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
async function getPeople() {
    const queryText = "SELECT * FROM `people_with_meetings_visits_count` WHERE person_id != 30 AND person_id != 77"
    const [ dataFromDb ] = await pool.query(queryText)
    let humansArr = []
    for (person of dataFromDb) {
        let humanPhotoDir = ""
        let triedPath = path.join(__dirname, "photos", `${person.person_id}.jpg`)
        if (fs.existsSync(triedPath)) {
            humanPhotoDir = path.join(__dirname, "photos", `${person.person_id}.jpg`)
        }
        else {
            humanPhotoDir = path.join(__dirname, "photos", `annonymous.jpg`)
        }
        let realCliquePhotoPath = ""
        const pngCliquePhotoPath = path.join(__dirname, "cliques_photos", `${person.known_from}.png`)
        const jpgCliquePhotoPath = path.join(__dirname, "cliques_photos", `${person.known_from}.jpg`)
        if (fs.existsSync(pngCliquePhotoPath)) {
            realCliquePhotoPath = pngCliquePhotoPath
        }
        if (fs.existsSync(jpgCliquePhotoPath)) {
            realCliquePhotoPath = jpgCliquePhotoPath
        }

        let jsonToAdd = {"nameAndSurname": `${person.name} ${person.surname}`, "photoPath": `${humanPhotoDir}`, "visitCount": person.visit_count, "otherMeetings":person.meetings_count, "clique": person.known_from, "cliquePhoto": `${realCliquePhotoPath}`}
        humansArr.push(jsonToAdd)
    }
    return humansArr
}
module.exports = getPeople