require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

// //alternative way of connecting
// const connection = `postgresql:${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

//pool.connect();

// const fetch = pool.query('Select * from reviews where id < 10', (err, res) => {
//   if (!err) {
//     console.log(res.rows);
//   } else {
//     console.log(err.message);
//   }
//   pool.end;
// });

//Define queries
let fetch = () => {
  console.log('inside of database query');
  pool.query('Select * from reviews where id < 10', (err, res) => {
    if (!err) {
      console.log(res.rows);
    } else {
      console.log(err.message);
    }
    pool.end;
  });
};

module.exports.pool = pool;
module.exports.fetch = fetch;