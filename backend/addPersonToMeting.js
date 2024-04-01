var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
//const { request } = require('http');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addPersonToMeeting(meetingId, humanId) {
    const inserRequest = pool.query("INSERT INTO `meeting_human` (`meeting_id`, `human_id`) VALUES (?, ?);", [meetingId, humanId])
}
module.exports = addPersonToMeeting