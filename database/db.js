require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
});

// //alternative way of connecting
// const connection = `postgresql:${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

//Define queries
pool
  .query('SELECT NOW() as now')
  .then(response => console.log(response.rows[0]))
  .catch(error => console.error(error.stack));