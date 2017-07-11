'use strict';

const assert = require('assert');

const pg = require('pg');
var config = {
  user: process.env.db_user,
  database: process.env.db_name,
  password: process.env.db_password,
  host: process.env.db_host,
  port: process.env.db_port,
  max: 10, // max 10 clients in pool
  idleTimeoutMillis: 10000, //10 seconds
  ssl: true // prevent error when connecting to pg db
};
const pool = new pg.Pool(config);

// connect to our database

pool.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected successfully to server.");
    }
});

exports.insert = function (db, callback) {
  db.messages.insertMany([{
    a: 1,
  }, {
    a: 2,
  }, {
    a: 3,
  }], (err, result) => {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Inserted 3 documents into the document collection');
    callback(result);
  });
};