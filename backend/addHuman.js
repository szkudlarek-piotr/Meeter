var mysql      = require('mysql2');
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function addHuman(name, surname, gender, fbLink, city, clique_id) {
    await pool.query("INSERT INTO `party_people` (`ID`, `name`, `surname`, `lives_where`, `gender`, `klika_id`, `fb_link`) VALUES (NULL, ?, ?, ?, ?, ?, ?);", [name, surname, city, gender, clique_id, fbLink])
}
module.exports = addHuman