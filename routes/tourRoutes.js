const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// POST /tour/234sss/reviews
// GET /tour/234sss/reviews

// MOUNTING ROUTERS - IT REQUIRES MERGE PARAMS
// so in reviewRoutes we neet to do this ===>>>>> const router = express.Router({ mergeParams: true });
router.use('/:tourId/reviews', reviewRouter);

// this runs only when params includes an ID
// router.param("id", tourController.checkID);
router.get(
  '/top-5-cheap',
  tourController.aliasTopTours,
  tourController.getAllTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get(
  '/monthly-plan/:year',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour
);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.updateTour
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour
);

// router
//   .route("/")
//   .get(tourController.getAllTours)
//   .post(tourController.createTour);
// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
