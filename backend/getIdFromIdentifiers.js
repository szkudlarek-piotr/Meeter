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
 async function getId(name, surname, fbLink) {
    const [ returnedId ] = await pool.query("SELECT ID from party_people WHERE name = ? AND surname = ? AND fb_link = ?;", [name, surname, fbLink])
    return returnedId
 }
 module.exports = getId