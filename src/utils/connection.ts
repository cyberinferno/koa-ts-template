import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import config from '../config';

const connectionOptions: ConnectionOptions = {
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  logging: false,
  entities: config.db.dbEntitiesPath,
  migrations: config.db.migrationsPath,
  cli: {
    entitiesDir: __dirname + '/../db/entities',
    migrationsDir: __dirname + '/../db/migrations',
  },
  cache: true,
};

let connection: Connection;

async function createDbConnection() {
  if (connection && connection.isConnected) {
    return connection;
  }

  try {
    connection = await createConnection(connectionOptions);
    console.log('Connected to database!');
    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export {
  connection,
  createDbConnection,
};
