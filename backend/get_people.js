var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
const fs = require('fs')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getPeople() {
    let returnedArray = []
    const [databaseArray] = await pool.query("SELECT * FROM party_people WHERE ID !=77 ORDER BY surname, name")
    for (let i=0; i < databaseArray.length; i++) {
        let person = databaseArray[i]
        let jsonToAdd = {}
        jsonToAdd["id"] = person.ID
        jsonToAdd["name"] = person.name
        jsonToAdd["surname"] = person.surname
        jsonToAdd["fbLink"] = person.fb_link
        let photoDir = path.join(__dirname, "photos", person.ID.toString() + ".jpg")
        if (!fs.existsSync(photoDir)) {
            photoDir = path.join(__dirname, "photos", "anonymous.jpg")
        }
        jsonToAdd["photoDir"] = photoDir
        returnedArray.push(jsonToAdd)
    }
    return returnedArray
}
module.exports = getPeople