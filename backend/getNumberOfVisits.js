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

async function getNumberOfVisists() {
    const [databaseArray] = await pool.query("SELECT pp.ID, COUNT(vg.guest_id) AS visit_count FROM party_people pp LEFT JOIN visit_guest vg ON pp.ID = vg.guest_id GROUP BY pp.ID;")
    let arrayWithoutMe = []
    for (record of databaseArray) {
        if (record["ID"] != 77)
        arrayWithoutMe.push(record)
    }
    return arrayWithoutMe
}
//getNumberOfVisists()
module.exports = getNumberOfVisists