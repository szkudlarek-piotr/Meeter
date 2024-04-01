var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getPeopleFromSubstring(deliveredSubstring) {
    const substringWithPercents = `%${deliveredSubstring}%`
    let returnedArray = []
    const [ queryResult ] = await pool.query(`SELECT * FROM party_people WHERE CONCAT(name, ' ', surname) LIKE ? ORDER BY surname;`, [substringWithPercents])
    for (human of queryResult) {
        let newHumanJson = {}
        const nameAndSurname = `${human.name} ${human.surname}`
        newHumanJson["nameAndSurname"] = nameAndSurname
        const stringifiedId = human.ID.toString()
        const nameOfPersonPhoto = stringifiedId + ".jpg"
        let dirToHumanPhoto = path.join(__dirname, "photos", nameOfPersonPhoto)
        if (!fs.existsSync(dirToHumanPhoto)) {
            dirToHumanPhoto = path.join(__dirname, "photos", "anonymous.jpg")
        }
        newHumanJson["photoDir"] = dirToHumanPhoto
        newHumanJson["id"] = human.ID
        returnedArray.push(newHumanJson)
    }
    return returnedArray  
}
module.exports = getPeopleFromSubstring