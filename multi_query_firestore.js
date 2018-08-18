'use strict';

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



var dbClients = db.collection('clients');

const minimist = require('minimist')

let args = minimist(process.argv.slice(2),{
    default: {
        comp1: '==',
        comp2: '=='
    },
});

var qObj = getQueryArgs(args);

if (qObj)
{
    var queryRef = dbClients.where(qObj['field1'], args['comp1'], qObj['value1'])
        .where(qObj['field2'], args['comp2'], qObj['value2']).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.error('Error getting documents', err);
    });
    
}

function getQueryArgs(args)
{
    var fields = ['name', 'adress1', 'city', 'state', 'zip', 'added'];
    var qOffset = 1;
    var qObj = {};
    var added = false;

    for (var term in args)
    {
        if(fields.indexOf(term) > -1)
        {
            var field="field"+qOffset;
            var value="value"+qOffset;

            qObj[field]=term;
            qObj[value]=args[term];
            added = true;
            qOffset++;
        }
    }

    if(added)
    {
        return qObj;
    }
    return false;

}
