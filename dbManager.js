'use strict';

const assert = require('assert');

const pg = require('pg');
const config = {
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
pool.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Connected successfully to Postgre DB at ${config.host}.`);


        // check if db table exists
        // if does not exist, create a new table
    }
});

exports.insert = (obj) => {
  // insert new obj into db table
};