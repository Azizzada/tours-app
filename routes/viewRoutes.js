const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTours);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.post('/submit-user-data', viewController.updateUserData);

module.exports = router;
