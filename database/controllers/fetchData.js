const { pool } = require('../models/db')

//Define queries
const getReviews = (product, page, count, sort) => {

  const pageNumber = Number(page);
  const countNumber = Number(count);
  const startIndex = pageNumber * countNumber - (countNumber - 1);
  const endIndex = pageNumber * countNumber;

  const queryText = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, photos
  FROM (SELECT reviews.review_id, rating, summary, recommend, response, body, to_char(to_timestamp(date), 'DD/MM/YYYY HH24:MI:SS') AS date, reviewer_name, (SELECT JSON_AGG(result)
  FROM (SELECT photos.id, url FROM photos WHERE review_id = reviews.review_id) AS result) AS photos, ROW_NUMBER () OVER (ORDER BY review_id ASC)
  FROM reviews WHERE product_id = $1) AS page WHERE row_number BETWEEN $2 AND $3`;

  const parameters = [product, startIndex, endIndex];
  return pool.query(queryText, parameters);
};

const getMeta = (product) => {
  const queryText = `SELECT JSON_BUILD_OBJECT(
    'product_id', $1::int,
    'ratings', (SELECT JSON_OBJECT_AGG(rating, count) FROM
    (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = $1::int
    GROUP BY rating) AS subquery),
    'recommended', (SELECT JSON_OBJECT_AGG(recommend, count) FROM
    (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = $1::int
	GROUP BY recommend) AS subquery),
    'characteristics', (SELECT JSON_BUILD_OBJECT(
      'product_id', $1::int,
      'ratings', (SELECT JSON_OBJECT_AGG(rating, count) FROM
          (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = $1::int
          GROUP BY rating) AS subquery),
      'recommend', (SELECT JSON_OBJECT_AGG(recommend, count) FROM
          (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = $1::int
          GROUP BY recommend) AS subquery),
      'characteristics', (SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT(
        'id', id,
        'value', avg)
      ) FROM
      (SELECT characteristics.name, characteristics.id, avg(ratings.value)
        FROM characteristics AS characteristics JOIN ratings AS ratings
        ON characteristics.id = ratings.characteristic_id WHERE product_id = $1::int
        GROUP BY characteristics.id) AS conjoined)
      )
    )
  )`;

  const parameter = [product]
  return pool.query(queryText, parameter);
}

const addReview = (review) => {
  const queryText = `INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  VALUES ($1, $2, (select EXTRACT(EPOCH FROM now())), $3, $4, $5, false,
  $6, $7, DEFAULT, DEFAULT);`;
  const parameters = [review.product_id, review.rating, review.summary, review.body, review.recommend, review.name, review.email];
  return pool.query(queryText, parameters);
};

const markHelpful = (reviewID) => {
  const queryText = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`;
  const parameter = [reviewID];
  return pool.query(queryText, parameter);
};

const reportReview = (reviewID) => {
  const queryText = `UPDATE reviews SET reported = true WHERE review_id = $1`;
  const parameter = [reviewID];
  return pool.query(queryText, parameter);
};

module.exports.getReviews = getReviews;
module.exports.getMeta = getMeta;
module.exports.addReview = addReview;
module.exports.markHelpful = markHelpful;
module.exports.reportReview = reportReview;