console.log("test0")
var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
database : 'test'
});
console.log("test1")
let all_humans = []
connection.connect();
console.log("Dupa")
let test_query = "SELECT * FROM party_people;"
connection.query(test_query, function (error, results, fields) {
if (error)   throw error;
for (let i=0; i<results.length; i++) {
    //console.log(i)
    let photo_path = `./photos/${results[i].ID}.jpg`
    let new_human = {"id": results[i].ID, "name": results[i].name, "surname": results[i].surname, "lives_in": results[i].lives_where, "gender": results[i].gender, "facebook_link": results[i].fb_link, "clique": results[i].klika_id, "photography_path": photo_path}
    let identifier = `${results[i].name}_${results[i].surname}_${results[i].ID}`
    console.log(new_human)
    all_humans[identifier]=new_human
}

console.log(all_humans)
});
connection.end();
return all_humans