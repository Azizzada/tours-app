const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      validate: [validator.isAlpha, 'our name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // each time the data is outputed as JSON we want to include our VIRTUAL property in it... like the one above...durationWeeks
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Creating virtual property: we dont need additional fields all time, in this case converting days to week.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before save() and create() only
// THIS refer to document we just send that is not saved yet. this is why its called document middleware
tourSchema.pre('save', function (next) {
  // slugify librabry will give us a slug that can be used in url... so ==> my name is enayat =>> my-name-is-enayat
  this.slug = slugify(this.name, { lower: true });
  next();
});

// this is a POST middleware
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next()
// })

// QUERY MIDDLEWARE: it allow us to run function before or after a QUERY is executed. here we us it on FIND query
// THIS will refer to QUERY and NOT the DOCUMENT.
// for each Type of query we need to specify its type like FIND, FINDONE, FINDBYID..
tourSchema.pre(/^find/, function (next) {
  // We asking that when we find all tour remove SECRETTOUR with TRUE value from the list.
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
  // in this case this.pipeline refers to all the aggregates we set for the two routes.
  // here we dont want to show SECRET TOUR on aggregates as well.
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
