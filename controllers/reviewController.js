const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./../controllers/handlerFactory');

exports.getAllReviews = factory.getAll(Review); //REFACTORED CODE => CAN COMMENT THIS AND USE BELOW AS WELL
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getReview = factory.getOne(Review); //REFACTORED CODE => CAN COMMENT THIS AND USE BELOW AS WELL
// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);

//   if (!review) {
//     return next(new AppError('No review found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: review,
//     },
//   });
// });

exports.updateReview = factory.updateOne(Review); //REFACTORED CODE => CAN COMMENT THIS AND USE BELOW AS WELL
// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!review) {
//     return next(new AppError('No review found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: review,
//     },
//   });
// });

exports.deleteReview = factory.deleteOne(Review); //REFACTORED CODE => CAN COMMENT THIS AND USE BELOW AS WELL
// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndDelete(req.params.id);

//   if (!review) {
//     return next(new AppError('No review found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
