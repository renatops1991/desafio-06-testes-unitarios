import { Connection, createConnection, getConnectionOptions } from 'typeorm';
interface IOptions {
  host: string;
  database: string;
}

getConnectionOptions().then((options) => {
  const newOptions = options as IOptions;
  newOptions.host =  process.env.NODE_ENV === 'test' ? 'localhost' : 'challenges_ignite';
  newOptions.database = process.env.NODE_ENV === 'test'
  ? 'challenges_ignite_test'
  : 'finapi';

  createConnection({
    ...options,
  });
});