var mysql      = require('mysql2');
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addGuestToVisit(idOfVisit, idOfGuest) {
    const textOfRequest = "INSERT INTO `visit_guest` (`visit_id`, `guest_id`) VALUES (?, ?)"
    const postRequest = await pool.query(textOfRequest, [idOfVisit, idOfGuest])
}
module.exports = addGuestToVisit