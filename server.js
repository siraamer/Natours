import dotenv from 'dotenv';
import mongoose from 'mongoose';
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Oh NO! Uncaught Exception');

  process.exit(1);
});
dotenv.config({ path: './config.env' });

import app from './app.js';

const DB = process.env.DATABASE;

mongoose.connect(DB).then((conn) => {
  console.log('Database connected seccessful!');
});

const port = process.env.PORT || 7000;

const server = app.listen(port, () => console.log(`Sever Running On Port ${port}!`));

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Oh NO! Unhandled Rejection ');
  server.close(() => {
    process.exit(1);
  });
});
