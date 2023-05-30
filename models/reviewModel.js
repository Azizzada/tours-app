const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      // to add reference to Tour model
      // BUT to give REF to review models we must create VIRTUAL ref in USER model
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      // to add reference to Tour model
      // BUT to give REF to review models we must create VIRTUAL ref in USER model
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    // each time the data is outputed as JSON we want to include our VIRTUAL property in it... like the one above...durationWeeks
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// we are defining what to show with the review. in this case, we want to show the user who wrote review and the tour it belongs to.
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
