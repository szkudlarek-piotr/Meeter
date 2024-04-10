var mysql      = require('mysql2');
const datetime = require('date-and-time')
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getAllMeetingsDates() {
    const queryToSend = "SELECT meeting_date FROM meetings"
    const [ queryResult ] = await pool.query(queryToSend)
    let returnedArray = []

    for (date of queryResult) {
        let properDate = datetime.addHours(date["meeting_date"], 18)
        const objToAdd = {properDate}
        returnedArray.push(objToAdd)
    }
    return returnedArray
}
module.exports = getAllMeetingsDates