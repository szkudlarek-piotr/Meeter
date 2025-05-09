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

async function getMeetingId(date, shortdesc) {
    const requestToAsk = "SELECT ID FROM meetings WHERE meeting_date = ? AND title_after_hover = ?"
    const [ idOfMeeting ] = await pool.query(requestToAsk, [date, shortdesc])
    return idOfMeeting
}
module.exports = getMeetingId