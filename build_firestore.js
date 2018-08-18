const readline = require('readline');
const fs = require('fs');
const admin = require('firebase-admin');

var imports = require('./imports.js');

admin.initializeApp({
  credential: admin.credential.cert(imports.serviceAccountKey)
});


var db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);


const rl = readline.createInterface({
  input: fs.createReadStream('clients'),
  crlfDelay: Infinity
});

var dbColl = db.collection('clients');

rl.on('line', (line) => {
  var splitLine = line.split('\t');
  //console.log(line);
  var addDoc = db.collection('clients').add({
    name: splitLine[0],
    address1: splitLine[1],
    city: splitLine[2],
    state: splitLine[3],
    zip: splitLine[4],
    added: Date.now()
  })
  .then(ref => {
    console.log('Added document with ID: ', ref.id);
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

});

