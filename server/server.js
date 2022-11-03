require('dotenv').config();
const express = require('express');
const app = express();

console.log('this is the user: ', process.env.USER, 'this is the port: ', process.env.PORT, process.env.HOST);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});
