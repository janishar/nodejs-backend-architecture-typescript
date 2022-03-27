import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { db } from '../config';

// Build the connection string
const dbURI = `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${
  db.name
}`;

// If above gives problems the following will work:
// const dbURI = `mongodb+srv://${db.user}:${db.password}@${db.host}/${db.name
//   }?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info('Mongoose connection done');
  })
  .catch((e) => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });

// Funtion to Initialize Collections in DB
function initCollection(collName: String) {
  if (collName == "api_keys") {
    mongoose.connection.createCollection('api_keys')
    mongoose.connection.collection("api_keys").insertOne({
      metadata: 'To be used by the xyz vendor',
      key: db.apikey,
      version: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else if (collName == "roles") {
    mongoose.connection.createCollection('roles');
    mongoose.connection.collection("roles").insertMany([
      { code: 'LEARNER', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'WRITER', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'EDITOR', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  }
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info('Mongoose default connection open to ' + dbURI);
  //trying to get collection names, if they do not exist then create them. this will run only once to inititalize db schema
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    let keyFlag = false
    let roleFlag = false
    for (let i = 0; i < names.length; i++) {
      if (names[i].name == "api_keys") {
        keyFlag = true
      }
      if (names[i].name == "roles") {
        roleFlag = true
      }
    }
    if (!keyFlag) {
      console.log("in key")
      initCollection("api_keys")
    }
    if (!roleFlag) {
      console.log("in role")
      initCollection("roles")
    }
  });
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
