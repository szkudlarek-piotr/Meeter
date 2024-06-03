const mysql = require('mysql2')
var dotenv = require('dotenv');
const datetime = require('date-and-time')
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addQuote(authorId, quote) {
    const requestTemplate = "INSERT INTO `golden_quotes` (`quote_id`, `human_id`, `quote`) VALUES (NULL, ?, ?)"
    const postQuoteRequest = pool.query(requestTemplate, [authorId, quote])
}
module.exports = addQuote
