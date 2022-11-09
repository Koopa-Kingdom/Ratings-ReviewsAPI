require('dotenv').config();
const express = require('express');
const app = express();
const {pool, getReviews, getMeta, markHelpful, reportReview} = require('../database/db.js');

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
  let product = req.query.product_id;
  let rating = req.query.rating;
  let summary = req.query.summary;
  let body = req.query.body;
  let recommend = req.query.recommend;
  let name = req.query.name;
  let email = req.query.email;
  let photos = req.query.photos;
  let characteristics = req.query.characteristics;

  res.send('Review was posted');
});

//Update a review as helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  let reviewID = req.params.review_id;
  markHelpful(reviewID)
    .then(() => res.status(204).end('Updated to helpful'))
    .catch(err => console.error(err.stack));
});

//Update a review as reported
app.put('/reviews/:review_id/report', (req, res) => {
  let reviewID = req.params.review_id;
  reportReview(reviewID)
    .then(() => res.status(204).end('Reported!'))
    .catch(err => console.error(err.stack));
});