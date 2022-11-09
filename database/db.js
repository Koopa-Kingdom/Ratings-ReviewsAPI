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
const getReviews = (product, page, count, sort) => {
  return pool.query(`SELECT reviews.review_id, rating, summary, recommend, response, body, date, reviewer_name, (SELECT JSON_AGG(result) FROM
    (SELECT photos.id, url FROM photos WHERE review_id = reviews.review_id) AS result) AS photos
  FROM reviews WHERE product_id = ${product};`);
};

const getMeta = (product) => {
  return pool.query(`SELECT product_id,
  (SELECT JSON_OBJECT_AGG(rating, count) FROM
    (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = ${product}
    GROUP BY rating) AS subquery) AS ratings,
  (SELECT JSON_OBJECT_AGG(recommend, count) FROM
    (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = ${product}
	GROUP BY recommend) AS subquery) AS recommended,
name FROM characteristics WHERE product_id = ${product};`);
}

const addReview = () => {

};

const markHelpful = (reviewID) => {
  return pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${reviewID}`);
};

const reportReview = (reviewID) => {
  return pool.query(`UPDATE reviews SET reported = true WHERE review_id = ${reviewID}`);
};

module.exports.pool = pool;
module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.addReview = addReview;
module.exports.markHelpful = markHelpful;
module.exports.reportReview = reportReview;

//Syntax for writing aggregate expressions

//This is the main query using JSON_AGG:
// SELECT column names + (new column) FROM reviews WHERE product_id = value;

//However, we need to aggregate data via a subquery to add the new photos column:
// SELECT JSON_AGG(result) FROM (subquery results) AS result AS subquery alias;

//The subquery would be written as follows:
// SELECT photos.id, url FROM photos WHERE review_id = value;

//Result of compounding all the expressions:
// SELECT reviews.review_id, rating, summary, recommend, response, body, date, reviewer_name,
// (SELECT JSON_AGG(result) FROM
// (SELECT photos.id, url FROM photos WHERE review_id = reviews.review_id) AS result AS photos)
// FROM reviews WHERE product_id = ${product};


//This is the main query using JSON_OBJECT_AGG:
// SELECT column names + (new column) FROM ratings WHERE product_id = value;

//New column is the result of aggregating data:
// SELECT JSON_AGG(key, value) FROM (subquery results) AS result;

//The subquery for the aggregate function:
// SELECT col, agg(col) FROM ratings WHERE product_id = value GROUP BY col AS result;

//The result of combining all the expressions:

// SELECT JSON_OBJECT_AGG(name, count) FROM
//     (SELECT name, COUNT(name) FROM characteristics WHERE product_id = 66642
//     GROUP BY name) AS subquery

// SELECT id,
//   (SELECT AVG(value) FROM ratings
//   WHERE characteristic_id = characteristics.id) AS average
// FROM characteristics WHERE product_id = 66642;

// SELECT ROW_TO_JSON(result) FROM (SELECT id,
//   (SELECT AVG(value) FROM ratings
//   WHERE characteristic_id = characteristics.id) AS average
// FROM characteristics WHERE product_id = 66642) AS result;