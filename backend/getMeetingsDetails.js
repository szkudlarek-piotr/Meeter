var mysql      = require('mysql2');
var dotenv = require('dotenv');
const photoDirFromId = require('./getPhotoDirFromHumanId.js');
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function getMeetingsDetails(humanId) {
    const meetingsReqText = `
    SELECT CONCAT(party_people.name, " ", party_people.surname) AS humanName ,meetings.meeting_date as meeting_date, meetings.Place as meeting_place ,meetings.title_after_hover as shortDesc, meetings.long_desc as longDesc FROM meeting_human 
    JOIN meetings ON meetings.ID = meeting_human.meeting_id
    JOIN party_people ON party_people.ID = meeting_human.human_id
    WHERE meeting_human.human_id = ?
    ORDER BY meetings.meeting_date;
    `
    
    try {
        const [meetingsReq] = await pool.query(meetingsReqText, [humanId])
        let returnedJson = {"photo": photoDirFromId(humanId), "humanName":meetingsReq[0].humanName, meetings: []}
        for (meeting of meetingsReq) {
            let objectToAdd = {"date": meeting.meeting_date,"place": meeting.meeting_place, 'shortDesc': meeting.shortDesc, "longDesc": meeting.longDesc}
            returnedJson["meetings"].push(objectToAdd)
        }
        return returnedJson
    }
    catch {
        const [noMeetingsReq] = await pool.query(`SELECT CONCAT(name, " ", surname) as human_name FROM party_people WHERE ID = ?`, [humanId])
        returnedJson = {"photo": photoDirFromId(humanId), "humanName":noMeetingsReq[0].human_name, meetings: []}
        return returnedJson
    }
    
}
module.exports = getMeetingsDetails