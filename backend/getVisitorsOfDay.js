var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const date = require('date-and-time');

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getVisitorsOfTheDay() {
    const myRequest = "SELECT visits.visit_date, visits.visit_duration, visit_guest.guest_id FROM visit_guest JOIN visits ON visits.visit_id = visit_guest.visit_id"
    const [ requestedData ] = await pool.query(myRequest)
    let returnedJson = {}
    for (let i = 0; i < requestedData.length; i++) {
        const checkedRecord = requestedData[i]
        const timeFromDatabase = checkedRecord.visit_date
        //on to czyta jakby brał datę z UK, czyli wychodzi dzień wcześniej o 23
        const dateOfVisitStart = date.addHours(timeFromDatabase,13)
        const guestId = checkedRecord.guest_id.toString()
        const visitDuration = checkedRecord.visit_duration
        //console.log(dateOfVisitStart)
        const pathToHumanPhoto = path.join(__dirname, "photos", guestId + ".jpg")
        if (!returnedJson.hasOwnProperty(dateOfVisitStart)) {
            returnedJson[dateOfVisitStart] = [pathToHumanPhoto]
        }
        else {
            returnedJson[dateOfVisitStart].push(pathToHumanPhoto)
        }
        if (visitDuration > 1) {
            const lastDayDate = date.addDays(dateOfVisitStart, visitDuration)
            let dateIterator = date.addDays(dateOfVisitStart,1)
            while (!date.isSameDay(dateIterator, lastDayDate)) {
                //console.log(`Dodaję ${dateIterator}`)
                if (!returnedJson.hasOwnProperty(dateIterator)) {
                    returnedJson[dateIterator] = [pathToHumanPhoto]
                }
                else {
                    returnedJson[dateIterator].push(pathToHumanPhoto)
                }
                dateIterator = date.addDays(dateIterator, 1)
            }
        }
    }
    return returnedJson
}
module.exports = getVisitorsOfTheDay