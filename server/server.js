require('dotenv').config();
const express = require('express');
const app = express();
const {getReviews, getMeta, addReview, markHelpful, reportReview} = require('../database/controllers/fetchData.js');
//const cors = require('cors');

//app.use(cors());

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

  if (count > 20) {
    count = 20;
  }

  getReviews(product, page, count, sort)
    .then((data) => {
      let formattedData = {
        product: product,
        page: page,
        count: count,
        results: data.rows.slice(0, count)
      }
      console.log(data.rows.slice(0, count));
      res.status(200).send(formattedData);
    })
    .catch(error => console.error(error.stack));
});

//Get review metadata for a product
app.get('/reviews/meta', (req, res) => {
  let product = req.query.product_id;

  getMeta(product)
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch(error => console.error(error.stack));
});

//Add a review to a product
app.post('/reviews', (req, res) => {
  console.log(req.body)
  addReview(req.body)
    .then(() => {
      res.status(201).send('Created');
    })
    .catch(err => console.error(err.stack));
});

//Update a review as helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  let reviewID = req.params.review_id;
  markHelpful(reviewID)
    .then(() => res.status(204).send('Updated to helpful'))
    .catch(err => console.error(err.stack));
});

//Update a review as reported
app.put('/reviews/:review_id/report', (req, res) => {
  let reviewID = req.params.review_id;
  reportReview(reviewID)
    .then(() => res.status(204).send('Reported!'))
    .catch(err => console.error(err.stack));
});