require('dotenv').config();
const express = require('express');
const app = express();
const {pool, getReviews, getMeta} = require('../database/db.js');

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
});

//pool.connect();

// //Invoke middleware
app.use(express.json());
// app.use(express.urlencoded());


//Define API routes
//Get reviews for a product

app.get('/reviews', (req, res) => {
  let product = req.query.product_id;
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = req.query.sort || 'newest';

  getReviews(product)
    .then((data) => {
      let formattedData = {
        product: product,
        page: page,
        count: count,
        results: data.rows
      }
      res.status(200).send(formattedData);
    })
    .catch(error => console.error(error.stack));
});

//Get review metadata for a product
app.get('/reviews/meta', (req, res) => {
  let product = req.query.product_id;

  getMeta(product)
    .then((data) => {
      console.log(data.rows);
      let formattedData = {
        product_id: product,
        ratings: {},
        recommended: {},
        characteristics: {}
      }
      res.status(200).send(data.rows);
    })
    .catch(error => console.error(error.stack));
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