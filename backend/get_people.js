function getAllPeople() {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'test'
    });
    let all_humans = []
    connection.connect();
    let test_query = "SELECT * FROM party_people;"
    connection.query(test_query, function (error, results, fields) {
    if (error)   throw error;
    for (let i=0; i<results.length; i++) {
        new_human = {}
        let photo_path = `./photos/${results[i].ID}.jpg`
        new_human["id"] = results[i].ID
        new_human["name"] = results[i].name
        new_human["surname"] = results[i].surname
        new_human["lives_in"] = results[i].lives_in
        new_human["facebook_link"] = results[i].fb_link
        new_human["clique"] = results[i].klika_id
        new_human["photography_path"] = photo_path
        all_humans.push(new_human)
    }
    });
    connection.end();
    return JSON.stringify(all_humans)
}
module.exports = getAllPeople