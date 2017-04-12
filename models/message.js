var mongoose = require('mongoose'),
    assert = require('assert');

// default connection URL -- change in production
var url = 'mongodb://localhost:27017/vhacks-slackbot';
/*
mongoose.connect(url, function(err, db) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected successfully to server.");
        db.close();
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
