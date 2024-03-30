var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
//const { request } = require('http');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getCliqueHumanPhotosTable() {
    let returnedArray = []
    const tableRequest = "SELECT party_people.ID, party_people.name, party_people.fb_link, party_people.surname, nazwy_klik.known_from FROM party_people JOIN nazwy_klik ON party_people.klika_id = nazwy_klik.id;"
    let [ humanIdCliqueId ] = await pool.query(tableRequest)
    for (let i = 0; i < humanIdCliqueId.length; i++) {
        let newRecordToAdd = {}
        const analyzedRecod = humanIdCliqueId[i]
        const nameAndSurname = analyzedRecod.name + " " + analyzedRecod.surname
        const humanPhotoName = analyzedRecod.ID.toString() + ".jpg"
        let pathOfHumanPhoto = path.join(__dirname, "photos", humanPhotoName)
        if (!fs.existsSync(pathOfHumanPhoto)) {
            pathOfHumanPhoto = path.join(__dirname, "photos", "anonymous.jpg")
        }
        const humanKnownFrom = analyzedRecod.known_from
        newRecordToAdd["photoDir"] = pathOfHumanPhoto
        newRecordToAdd["known_from"] = humanKnownFrom
        newRecordToAdd["nameAndSurname"] = nameAndSurname
        newRecordToAdd["fb_link"] = analyzedRecod.fb_link
        returnedArray.push(newRecordToAdd)
    }
    return returnedArray
}
module.exports = getCliqueHumanPhotosTable
//getCliqueHumanPhotosTable()
