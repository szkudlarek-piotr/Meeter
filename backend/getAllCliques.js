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

async function getAllCliques() {
    let cliquesPhotosFolder = path.join(__dirname, "cliques_photos")
    const photosOfCliques = fs.readdirSync(cliquesPhotosFolder)
    let [ returnedArray ] = await pool.query("SELECT * FROM nazwy_klik")
    for (let i=0; i < returnedArray.length; i++) {
        let analyzedObject = returnedArray[i]
        const nameOfClique = analyzedObject.known_from
        for (let j=0; j < photosOfCliques.length; j++) {
            let nameOfChosenPhoto = photosOfCliques[j]
            if (nameOfChosenPhoto.includes(nameOfClique)) {
                const pathOfPhoto = path.join(cliquesPhotosFolder, nameOfChosenPhoto)
                analyzedObject["photoPath"] = pathOfPhoto
            }
        }
    }
    return returnedArray
}
module.exports = getAllCliques