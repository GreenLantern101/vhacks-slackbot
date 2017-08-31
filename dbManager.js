// use MONGO

'use strict';

const dbManager = () => {
  // Connection
  const pe = process.env;
  const url = `mongodb://${pe.user}:${pe.password}@${pe.db_host}:${pe.db_port}/${pe.db_name}`;

  let db = null;
  let collection = null;

  // connect to db, returns collection
  const connect = () =>
    require('mongodb').MongoClient.connect(url, {
      poolSize: 20,
    }) // default poolsize = 5
    .then((dbInst) => {
      console.log(`Connected to mongodb at ${url}`);
      // get db, collection
      db = dbInst;
      // get existing collection, or create if doesn't exist
      // NOTE: Collections are not created until the first document is inserted
      collection = db.collection('slackbot');
    }).catch(err => console.log(err));

  const find = (query) => {
    const cursor = collection.find(query);
    cursor.count((err, count) => {
      console.log(`Total matches: ${count}`);
    });
    return cursor;
  };

  const insert = doc => {
    // Update the document using an UPSERT operation, ensuring creation if it does not exist
    // does not change "_id" value
    collection.insert(doc)
      .then(res =>
        console.log('Inserted a doc.'),
      );
  }


  // be sure to close
  // https://docs.mongodb.com/manual/reference/method/db.collection.stats/#accuracy-after-unexpected-shutdown
  // can run validate() to verify correct stats
  const close = () => db.close()
    .then(() => {
      console.log('DB closed successfully.');
    });

  return {
    close,
    connect,
    find,
    insert,
  };
};

module.exports = dbManager;


/* old Postgre code

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
  idleTimeoutMillis: 10000, // 10 seconds
  ssl: true, // prevent error when connecting to pg db
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
*/