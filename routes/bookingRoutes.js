const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.getAllBookings
);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.createBooking
);
router.get(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.getBooking
);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.updateBooking
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.deleteBooking
);

module.exports = router;
