var pg = require('pg'),
    assert = require('assert');

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
var client = new pg.Client();

// connect to our database
/*
client.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected successfully to server.");
    }
});
*/
exports.insert = function(db, callback) {
    db.messages.insertMany([{
        a: 1
    }, {
        a: 2
    }, {
        a: 3
    }], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}

exports.update = function(db, callback) {
    db.messages.updateOne({
        a: 2
    }, {
        $set: {
            b: 1
        }
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
}

exports.delete = function(db, callback) {
    db.messages.deleteOne({
        a: 3
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}

exports.find = function(db, callback) {
    db.messages.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        assert.equal(2, docs.length);
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
}
