require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

//pool.connect();

//Define queries
let getReviews = (product, page, count, sort) => {
  return pool.query(`SELECT reviews.review_id, rating, summary, recommend, response, body, date, reviewer_name, (SELECT JSON_AGG(photos) FROM
    (SELECT photos.id, url FROM photos WHERE review_id = reviews.review_id) photos) AS photos
  FROM reviews WHERE product_id = ${product};`);
};

let getMeta = (product) => {
  return pool.query(`SELECT product_id, (SELECT JSON_AGG(ratings) FROM
    (SELECT ratings.id, value FROM ratings WHERE characteristic_id = characteristics.id) ratings) AS ratings,
  (SELECT JSON_AGG(reviews) FROM
    (SELECT recommend FROM reviews WHERE reviews.product_id = ${product}) reviews) as recommended,
  name FROM characteristics WHERE product_id = ${product};`);
};

let addReview = () => {

};

let markHelpful = () => {

};

let reportReview = () => {

};

module.exports.pool = pool;
module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.addReview = addReview;
module.exports.markHelpful = markHelpful;
module.exports.reportReview = reportReview;

//Thought process for writing aggregate expressions

//This is the main query:
// SELECT column names + (new column) FROM reviews WHERE product_id = value;

//However, we need to aggregate data via a subquery to add the new photos column:
// SELECT JSON_AGG(photos) FROM (subquery results) photos AS alias;

//The subquery would be written as follows:
// SELECT photos.id, url FROM photos WHERE review_id = value;

//Result of compounding all the expressions:
// SELECT reviews.review_id, rating, summary, recommend, response, body, date, reviewer_name,
// (SELECT JSON_AGG(photos) FROM
// (SELECT photos.id, url FROM photos WHERE review_id = reviews.review_id) photos AS photos)
// FROM reviews WHERE product_id = ${product};


//Main query for metadata:
// SELECT column names + (ratings) + (recommended) FROM characteristics WHERE product_id = value;

//Aggregate columns:
// SELECT JSON_AGG(ratings) FROM (subquery) ratings AS ratings
// SELECT JSON_AGG(reviews) FROM (subquery) reviews AS recommended

//Subqueries:
// SELECT id, value FROM ratings WHERE review_id = reviews.review_id;
// SELECT recommend FROM reviews WHERE product_id = value;


//Result:
// SELECT product_id,
// (SELECT JSON_AGG(ratings) FROM
// (SELECT id, value FROM ratings WHERE characteristic_id = characteristics.id) ratings) AS ratings,
// (SELECT JSON_AGG(reviews) FROM
// (SELECT recommend FROM reviews WHERE product_id = ${product}) reviews) AS recommended,
// FROM reviews WHERE product_id = ${product};