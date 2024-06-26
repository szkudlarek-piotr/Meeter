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

async function addMeeting(place, dateOfMeeting, description) {
    await pool.query("INSERT INTO `meetings` (`ID`, `meeting_date`, `Place`, `Food`, `Drinks`, `title_after_hover`) VALUES (NULL, ?, ?, '-', '-', ?);", [dateOfMeeting, place, description])
}
module.exports = addMeeting