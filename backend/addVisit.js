var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
const datetime = require('date-and-time')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addMeeting(date, duration, description) {
    let dateInProperFormat = new Date(date)
    const realDate = datetime.addHours(dateInProperFormat, 12)
    console.log(realDate)
    const postRequest = pool.query("INSERT INTO `visits` (`visit_id`, `visit_date`, `visit_duration`, `title_afte_hover`) VALUES (NULL, ?, ?, ?)", [date, duration, description])
}
module.exports = addMeeting