const mysql = require('mysql2')
var dotenv = require('dotenv');
const datetime = require('date-and-time')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
async function addEvent(name, place, start, stop, coming, leaving, genericPhotoName) {
    if (genericPhotoName != "NULL") {
        const requestText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);"
        const postRequest = await pool.query(requestText, [name, start, stop, coming, leaving, place, genericPhotoName])
    }
    else {
        const requestText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`) VALUES (NULL, ?, ?, ?, ?, ?, ?, '');"
        const postRequest = await pool.query(requestText, [name, start, stop, coming, leaving, place])
    }
}
module.exports = addEvent