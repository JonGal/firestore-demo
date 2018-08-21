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



var dbColl = db.collection('clients');
buildClients(db);

function buildClients(db)
{
    var rl = readline.createInterface({
      input: fs.createReadStream('clients'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      var splitLine = line.split('\t');
      var addObj =  BuildClientObj(splitLine);

      if (addObj)
      {
        addObj['added'] = Date.now();
        var addDoc = db.collection('clients').add(addObj)
          .then(ref => {
            console.log('Added document with ID: ', ref.id);
            buildPolicies(ref.id);
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          });
      }
      
    });
}


function buildPolicies(id)
{
    var rl = readline.createInterface({
      //input: fs.createReadStream('sample.txt'),
      input: fs.createReadStream('full_policies'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      var splitThisLine = line.split('\t');
      var addThisObj =  BuildPolicyObj(splitThisLine);

      if (addThisObj)
      {
        addThisObj['added'] = Date.now();
        var addDoc = db.collection('clients').doc(id).collection('policy').add(addThisObj)
          .then (ref => {
            console.log('Added policy with ID: ', ref.id);
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          });
      }

    });
}

function BuildClientObj(splitLine)
{
  var addObj = {};
  var added = false;

  if (splitLine[0])
  {
    addObj['name'] = splitLine[0];
    added = true;
  }

  if (splitLine[1])
  {
    addObj['address1'] = splitLine[1];
    added = true;
  }

  if (splitLine[2])
  {
    addObj['city'] = splitLine[2];
    added = true;
  }

  if (splitLine[3])
  {
    addObj['state'] = splitLine[3];
    added = true;
  }

  if (splitLine[4])
  {
    addObj['zip'] = splitLine[4];
    added = true;
  }

  if (added)
  {
    return addObj;
  }
  return added;
}

function BuildPolicyObj(splitLine)
{
  var addObj = {};
  var added = false;

  if (splitLine[0])
  {
    addObj['name'] = splitLine[0];
    added = true;
  }

  if (splitLine[1])
  {
    addObj['policyid'] = splitLine[1];
    added = true;
  }

  if (splitLine[2])
  {
    addObj['policytype'] = splitLine[2];
    added = true;
  }

  if (added)
  {
    return addObj;
  }
  return added;
}
