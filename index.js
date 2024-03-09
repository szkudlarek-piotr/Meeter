var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'test'
});
 
connection.connect();
let test_query = "SELECT party_people.name, party_people.surname, party_people.lives_where FROM party_people WHERE party_people.gender = 'M';"
connection.query(test_query, function (error, results, fields) {
  if (error)   throw error;
  const userInfo = results[0].name + " " + results[0].surname
  console.log('The solution is: ', userInfo);
  for (let i=0; i<results.length; i++) {
    let string_to_print = `Chłop zwie się ${results[i].name} ${results[i].surname} i mieszka we wsi o nazwie ${results[i].lives_where}.`
    console.log(string_to_print)
  }
});
 
connection.end();