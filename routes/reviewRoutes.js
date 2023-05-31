const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

// By default each router only has access of their specific routes, but in review post request there is no TOUR ID, but
// we still want to get access to TOUR ID to make our route work POST /tours/:tourID/reviews. and in order to have
// access to other router we need to merge the parameters.
const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getAllReviews);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  reviewController.createReview
);
router.patch('/:id', reviewController.updateReview);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;
