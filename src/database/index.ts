import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { db } from '../config';

// Build the connection string
const dbURI = `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${
  db.name
}`;

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

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info('Mongoose default connection open to ' + dbURI);
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
