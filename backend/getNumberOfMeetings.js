var mysql      = require('mysql2');
const path = require('path')
var dotenv = require('dotenv');
const { request } = require('http');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getNumberOfMeetings() {
    const [databaseArray] = await pool.query("SELECT party_people.ID, COUNT(meeting_human.human_id) AS meeting_count FROM party_people LEFT JOIN meeting_human ON party_people.ID = meeting_human.human_id GROUP BY party_people.ID;")
    let arrayWithoutMe = []
    for (record of databaseArray) {
        if (record["ID"] != 77)
        arrayWithoutMe.push(record)
    }
    //console.log(arrayWithoutMe)
    return arrayWithoutMe
}
//getNumberOfMeetings()
module.exports = getNumberOfMeetings