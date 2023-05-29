const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

// 2) ROUTES HANDLERS

// this runs only when params includes an ID
// router.param("id", tourController.checkID);
router.get(
  '/top-5-cheap',
  tourController.aliasTopTours,
  tourController.getAllTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', authController.protect, tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post('/', tourController.checkBody, tourController.createTour);
router.patch('/:id', tourController.updateTour);
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
