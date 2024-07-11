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

async function addWeddingPartner(partnerID, weddingID) {
    if (partnerID == "null") {
        const request_text = `UPDATE weddings SET partner_id = null WHERE weddings.id = ?`
        const cleanPartner = await pool.query(request_text, [weddingID])

        return [{"message": `Usunięto partnerkę z wesela numer ${weddingID}.`}]
    }
    else {
        try {
            const [genderCheckReqTest] = await pool.query("SELECT gender FROM party_people WHERE ID = ?", partnerID)
            const partnerGender = genderCheckReqTest[0]["gender"]
            if (partnerGender == "M") {
                return [{"message": "Jeżeli osobą towarzyszącą ma być mężczyzna, dodaj taki rekord bezpośrednio w bazie danych."}]
            }
            if (partnerGender == "F") {
                const request_text = "UPDATE `weddings` SET `partner_id` = ? WHERE `weddings`.`id` = ?"
                const patchRequest = await pool.query(request_text, [partnerID, weddingID])
                const partnerPhotoDir = path.join(__dirname, "photos", partnerID + ".jpg")
                return [{"message": "Pomyślnie zapisano partnerkę weselną.", "photoDir": partnerPhotoDir}]
        }
        }
        catch (error) {
            return [{"message": "Coś poszło nie tak."}]
        }
    }
}
module.exports = addWeddingPartner
