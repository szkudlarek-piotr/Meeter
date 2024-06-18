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
async function getSingleWedding(weddingId) {
    let returnedJson = {}
    const requestText = `SELECT * FROM weddings_with_coordinates WHERE id = ?`
    const [weddingRequest] = await pool.query(requestText, [weddingId])
    const weddingJson = weddingRequest[0]
    const monthsDict = {0: "stycznia", 1:"lutego", 2: "marca", 3: "kwietnia", 4: "maja", 5: "czerwca", 6:"lipca", 7: "sierpnia", 8:"września", 9:"października", 10: "listopada", 11:"grudnia"}
    const dateInWords = `${weddingJson["date"].getDate()} ${monthsDict[weddingJson["date"].getMonth()]} ${weddingJson["date"].getYear()+1900}`
    let partnerStatement = "Na to wesele jeszcze nie masz umówionej partnerki."
    if (weddingJson["partner_name"] != null) {
        partnerStatement = `Twoją partnerką jest ${weddingJson["partner_name"]}.`
    }

    returnedJson["church_lat"] = weddingJson.church_lat
    returnedJson["church_long"] = weddingJson.church_long
    returnedJson["wed_hal_lat"] = weddingJson.wed_hal_lat
    returnedJson["wed_hal_long"] = weddingJson.wed_hal_long
    returnedJson["hotel_lat"] = weddingJson.hotel_lat
    returnedJson["hotel_long"] = weddingJson.hotel_long
    returnedJson["church_name"] = weddingJson.church_name
    returnedJson["wed_hal_name"] = weddingJson.wed_hal_name
    returnedJson["groom_photo_dir"] = path.join(__dirname, "photos", weddingJson.groom_photo)
    returnedJson["bride_photo_dir"] = path.join(__dirname, "photos", weddingJson.bride_photo)
    const lovebirdsStatement = `Dnia ${dateInWords} ślub biorą ${weddingJson.groom_name} oraz ${weddingJson.bride_name}.\n\tKościół: ${returnedJson["church_name"]}.\n\tSala: ${returnedJson["wed_hal_name"]}.\n`
    const fullText = `${lovebirdsStatement} ${partnerStatement}`
    returnedJson["description"] = fullText
    if (weddingJson.my_partner_photo != null) {
        returnedJson["partner_photo_dir"] = path.join(__dirname, "photos", weddingJson.my_partner_photo)
    }
    console.log(returnedJson)
    return [ returnedJson ]
}
module.exports = getSingleWedding