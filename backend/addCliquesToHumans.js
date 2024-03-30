var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
//const { request } = require('http');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function addCliquesToHumans() {
    const fs = require('fs')
    let humanCliqueNameReq = "SELECT party_people.ID, nazwy_klik.known_from FROM party_people JOIN nazwy_klik ON party_people.klika_id = nazwy_klik.id;"
    let [ idKnownFromArray ] = await pool.query(humanCliqueNameReq)
    const cliquesPhotosFolder = path.join(__dirname, "cliques_photos")
    const numberOfPeople = idKnownFromArray.length
    let returnedArray = []
    for (let i = 0; i < numberOfPeople; i++) {
        let addedJson = {}
        let personId = idKnownFromArray[i].ID
        addedJson["humanId"] = personId
        let cliqueName = idKnownFromArray[i]["known_from"]
        let arrayOfCliquePhotos = fs.readdirSync(cliquesPhotosFolder) 
        for (let j=0; j<arrayOfCliquePhotos.length; j++) {
            let nameOfPhoto = arrayOfCliquePhotos[j]
            if (nameOfPhoto.includes(cliqueName)) {
                const photoPath = path.join(cliquesPhotosFolder, nameOfPhoto)
                addedJson["photoDir"] = photoPath
                returnedArray.push(addedJson)
            }
        }
    }
    return returnedArray
}
module.exports = addCliquesToHumans