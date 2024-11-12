var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const { request } = require('http');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addMeeting(place, dateOfMeeting, description, longDesc) {
    let [idOfAddedMeeting ] = await pool.query("INSERT INTO `meetings` (`ID`, `meeting_date`, `Place`, `title_after_hover`, `long_desc`) VALUES (NULL, ?, ?, ?, ?);", [dateOfMeeting, place, description, longDesc])
    return idOfAddedMeeting
}
module.exports = addMeeting