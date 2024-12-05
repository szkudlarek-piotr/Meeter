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
async function getFinalHumans(){ 
    let returnedArr = []

    const queryText = "SELECT * FROM final_humans"
    const [humansArr] = await pool.query(queryText)
    for (human of humansArr) {
        let humanPhotoDir = ""
        let cliquePhotoDir = ""
        const idAsString = human.id.toString()
        const humanName = human.full_name
        let possibleHumanPhotoPath = path.join(__dirname, "photos", idAsString + ".jpg")
        if (fs.existsSync(possibleHumanPhotoPath)) {
            humanPhotoDir = possibleHumanPhotoPath
        }
        else {
            humanPhotoDir = path.join(__dirname, "photos", "anonymous.jpg")
        }
        const cliquePhotoJpg = path.join(__dirname, "cliques_photos", human.clique_name + ".jpg")
        const cliquePhotoPng = path.join(__dirname, "cliques_photos", human.clique_name + ".png")
        if (fs.existsSync(cliquePhotoJpg)) {
            cliquePhotoDir = cliquePhotoJpg
        }
        if (fs.existsSync(cliquePhotoPng)) {
            cliquePhotoDir = cliquePhotoPng
        }
        const newDict = {"name": human.full_name, "photoDir": humanPhotoDir, "cliqueName": human.clique_name, "cliquePhoto": cliquePhotoDir, "visits": human.visit_c, "meetings": human.others_count, "quote": human.quote}
        returnedArr.push(newDict)
    }
    return returnedArr
}
module.exports = getFinalHumans