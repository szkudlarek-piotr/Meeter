var mysql      = require('mysql2');
const datetime = require('date-and-time')
var dotenv = require('dotenv');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getSleepers() {
    const [ sleepersJson ] = await pool.query("SELECT party_people.name, party_people.surname, visits.visit_date FROM visit_guest JOIN party_people ON party_people.ID = visit_guest.guest_id JOIN visits ON visits.visit_id = visit_guest.visit_id JOIN cities ON party_people.lives_where = cities.city_name WHERE visits.visit_duration > 1 AND cities.woj != 'mazowieckie' AND visit_date > '2024-04-01';")
    const monthsJson = {0: "stycznia", 1:"lutego", 2: "marca", 3: "kwietnia", 4: "maja", 5: "czerwca", 6:"lipca", 7: "sierpnia", 8:"września", 9:"października", 10: "listopada", 11:"grudnia"}
    for (sleeper of sleepersJson) {
        const nameAndSurname = `${sleeper.name} ${sleeper.surname}`
        const modifiedTime = datetime.addHours(sleeper.visit_date, 5)
        const dateByWords = `${modifiedTime.getDate()} ${monthsJson[modifiedTime.getMonth()]}`
        console.log(`${nameAndSurname} potrzebuje łóżka na ${dateByWords}.`)
    }
}
getSleepers()
