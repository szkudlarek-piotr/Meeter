var mysql      = require('mysql2');
var dotenv = require('dotenv');
const path = require('path')
const fs = require('fs')
const cliquesPhotosDir = path.join(__dirname, "cliques_photos")
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getSuggestedCliques(substring) {
    const allCliquesReqString = "SELECT * FROM nazwy_klik WHERE nazwy_klik.known_from LIKE ?"
    let [ arrayOfCliques ] = await pool.query(allCliquesReqString, [`%${substring}%`])
    //let returnedArray = []
    for (element of arrayOfCliques) {
        const nameOfClique = element["known_from"]
        const listOfCLiquePhotos = fs.readdirSync(cliquesPhotosDir)
        const numberOfClique = element.id
        for (nameOfCliquePhoto of listOfCLiquePhotos) {
            if (nameOfCliquePhoto.includes(nameOfClique)) {
                element["clique_photo"] = path.join(cliquesPhotosDir, nameOfCliquePhoto)
                break
            }
        }
    }
    return arrayOfCliques
}
module.exports = getSuggestedCliques