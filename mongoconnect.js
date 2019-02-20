const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let dbName = "greaternyUrlObject"; // placeholder
const assert = require('assert');
// const data2 = require('./urls.json'); // just for first I think?


let connectToDbAndRead = (urlObj, region, callback) => { // connect, read
    //console.log('this is firing');
    let client = new MongoClient(url);
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        let db = client.db(dbName);
        db.collection(region).find({}).toArray((err, docs) => {
            let mongoUrlObj = JSON.parse(JSON.stringify(docs[0])); // makes deep copy
            delete mongoUrlObj._id;
            callback(mongoUrlObj, client);
        });
        // console.log('closed the db relationship');
    });
};

let connectAndWrite = (urlObj, region) => {
    let client = new MongoClient(url);
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        let db = client.db((region + "UrlObject"));
        //let myDocuments = db.collection('somethingelse').find({});
        // db.collection('somethingelse').insertOne(urlObj); // working!
        db.collection(region).insertOne(urlObj); // working!

        //console.log(myDocuments);
        // these, I suppose must be inside the connect function?
        client.close();
        console.log('closed the db relationship');
    });
}

module.exports = {
    upsertObj: connectAndWrite,
    retrieveUrlObj: connectToDbAndRead,
    hello: "hello world",
}


connectAndWrite(data2, "greaterny");


// connectToDbAndRead(testSubject, connectCallback);



//let findDocuments = (db, region, callback) => {
//    //dbName = region + "UrlObject";



//    //let regionSpecificUrlObject = region + 'UrlObject';
//    //const collection = db.collection('urlObject');
//    //const collection = db.collection(regionSpecificUrlObject);

//    //const collection = db.collection('documents');

//    // vvv I don't think it works like this any more vvv
//    //collection.find({}).toArray(function (err, docs) {
//    //    assert.equal(err, null);
//    //    console.log("Found the following records");
//    //    console.log(docs);
//    //    // currentUsers = docs;
//    //    callback(docs);
//    //    console.log('closed the db relationship');
//    //})

//

// stolen from the other mongo project
//function findDocuments(db, region, callback) {
//    let regionSpecificUrlObject = region + 'UrlObject';
//    const collection = db.collection('urlObject');
//    //const collection = db.collection(regionSpecificUrlObject);

//    collection.find({}).toArray(function (err, docs) {
//        assert.equal(err, null);
//        console.log("Found the following records");
//        console.log(docs);
//        // currentUsers = docs;
//        callback(docs);
//        console.log('closed the db relationship');
//    })
//}

//findDocuments(client, 'greaterny', function () {
//    console.log('success?');
//});