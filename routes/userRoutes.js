const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ALTERNATIVE WAY: IF WE USE THIS IT WILL APPLY authController.protect TO ALL THE ROUTES AFTER THIS LINE OF CODE
// router.use(authController.protect)

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get('/me', authController.protect, userController.getMe);
router.patch(
  '/updateMe',

  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Alternative to authController.restrictTo('admin') all the routes below this is below line of code which will apply to every route below it
// router.use(authController.restrictTo('admin'))

// We can also DEFINE the routes like this. you notice that its diffrent than above but it does the same thing
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
