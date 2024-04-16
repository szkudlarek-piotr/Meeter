var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const datetime = require('date-and-time')

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getVisitorsOfTheDay() {
    const myRequest = "SELECT visits.visit_date, visits.title_afte_hover, visits.visit_duration, visit_guest.guest_id FROM visit_guest JOIN visits ON visits.visit_id = visit_guest.visit_id"
    const [ requestedData ] = await pool.query(myRequest)
    let returnedJson = {}
    for (let i = 0; i < requestedData.length; i++) {
        const checkedRecord = requestedData[i]
        console.log(checkedRecord)
        const timeFromDatabase = checkedRecord.visit_date
        //console.log(timeFromDatabase)
        //on to czyta jakby brał datę z UK, czyli wychodzi dzień wcześniej o 23
        const dateOfVisitStart = datetime.addHours(timeFromDatabase,13)
        const guestId = checkedRecord.guest_id.toString()
        const visitDuration = checkedRecord.visit_duration
        let pathToHumanPhoto = path.join(__dirname, "photos", guestId + ".jpg")
        if (!fs.existsSync(pathToHumanPhoto)) {
            pathToHumanPhoto = path.join(__dirname, "photos", "anonymous.jpg")
        }
        if (!returnedJson.hasOwnProperty(dateOfVisitStart)) {
            returnedJson[dateOfVisitStart] = {"photos": [pathToHumanPhoto], "title": checkedRecord.title_afte_hover}
        }
        else {
            returnedJson[dateOfVisitStart]["photos"].push(pathToHumanPhoto)
        }
        if (visitDuration > 1) {
            const lastDayDate = datetime.addDays(dateOfVisitStart, visitDuration)
            let dateIterator = datetime.addDays(dateOfVisitStart,1)
            while (!datetime.isSameDay(dateIterator, lastDayDate)) {
                if (!returnedJson.hasOwnProperty(dateIterator)) {
                    returnedJson[dateIterator] = {"photos": [pathToHumanPhoto], "title": checkedRecord.title_afte_hover}
                }
                else {
                    returnedJson[dateIterator]["photos"].push(pathToHumanPhoto)
                }
                dateIterator = datetime.addDays(dateIterator, 1)
            }
        }
    }
    console.log(returnedJson)
    return returnedJson
    //console.log(returnedJson)
}
//getVisitorsOfTheDay()
module.exports = getVisitorsOfTheDay