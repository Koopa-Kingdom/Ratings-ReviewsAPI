require('dotenv').config();

// const connection = {
//   host: process.env.HOST,
//   port: process.env.PORT,
//   database: process.env.DATABASE,
//   user: process.env.USER,
//   password: process.env.PASSWORD
// };

const connection = `postgresql:${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DATABASE}`;

const db;