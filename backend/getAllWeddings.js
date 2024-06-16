var mysql      = require('mysql2');
const path = require('path')
const fs = require('fs')
var dotenv = require('dotenv');
const { request } = require('http');
const date = require('date-and-time');
const { json } = require('express');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getAllWeddings() {
    let returnedArray = []
    const askedRequest = "SELECT * FROM weddings"
    const [ databaseWeddings ] = await pool.query(askedRequest)
    for (wedding of databaseWeddings) {
        let dateFromDatabase = wedding.date
        let realWeddingDate = date.addHours(dateFromDatabase, 12)
        const manPhotoName = wedding.man_id.toString() + ".jpg"
        const womanPhotoName = wedding.woman_id.toString() + ".jpg"
        let partnerPhotoName = ""
        if ( wedding["partner_id"] != null ) {
            partnerPhotoName = wedding.partner_id.toString() + ".jpg"
        } 
        const manPhotoPath = path.join(__dirname, "photos", manPhotoName)
        const womanPhotoPath = path.join(__dirname, "photos", womanPhotoName)
        const partnerPhotoPath = path.join(__dirname, "photos", partnerPhotoName)
        const infoAfterHover = wedding.info_after_hover
        let jsonToAdd = {"weddingID": wedding.id ,"manPhoto": manPhotoPath, "womanPhoto": womanPhotoPath, "date": realWeddingDate, "info_after_hover": infoAfterHover}
        if ( wedding["partner_id"] != null ) {
            jsonToAdd["partnerPhoto"] = partnerPhotoPath
        }
        returnedArray.push(jsonToAdd)
    }
    return returnedArray
}
module.exports = getAllWeddings