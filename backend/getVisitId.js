var mysql      = require('mysql2');
const datetime = require('date-and-time')
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function getVisitId(dateFromRequest, duration, description) {
    const dateInProperFormat = new Date(dateFromRequest)
    const modifiedTime = datetime.addHours(dateInProperFormat, 12)
    const writtenRequest = "SELECT visit_id FROM visits WHERE DATE(visit_date) = DATE(?) AND visit_duration = ? AND title_afte_hover = ?"
    const [ idOfMeeting ] = await pool.query(writtenRequest, [dateInProperFormat, duration,  description])
    return idOfMeeting
}
//getVisitId("2024-04-25", "1", ":Knskdjn")
module.exports = getVisitId