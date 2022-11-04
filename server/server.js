require('dotenv').config();
const express = require('express');
const app = express();
const {pool, fetch} = require('../database/db.js');

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});

//pool.connect();

// //Invoke middleware
// app.use(express.json());
// app.use(express.urlencoded());


//Define API routes
//Get reviews for a product
app.get('/reviews', (req, res) => {
  console.log('this is the query', req.query);
  let product = req.query.product_id;
  console.log('product id', product);

  res.send('These are the reviews');
});

//Get review metadata for a product
app.get('/reviews/meta', (req, res) => {
  fetch();
  res.send('This is the metadata');
  client.end;
});

//Add a review to a product
app.post('/reviews', (req, res) => {
  res.send('Review was posted');
});

//Update a review as helpful
app.put('/reviews/:review_id', (req, res) => {
  console.log('request params', req.params);
  let reviewID = req.params.review_id;
  console.log('review id', reviewID);

  res.send('Updated to helpful');
});

//Update a review as reported
app.put('/reviews/:review_id/report', (req, res) => {
  res.send('Reported');
});