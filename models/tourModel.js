const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'our name must only contain characters'],
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
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
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
    startLocation: {
      // GeoJSON is specialized type data that is used for locations
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // referencing / normalizing the guides to user
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // each time the data is outputed as JSON we want to include our VIRTUAL property in it... like the one above...durationWeeks
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// SINGLE INDEX
// this will create index for price and it will result in faster search for this item as mongoDB
// will not search the entire price objects but only those we specify
// tourSchema.index({ price: 1 });

// COMPOUNT INDEX
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Creating virtual property: we dont need additional fields all time, in this case converting days to week.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate of REVIEW MODEL that has reference to TOUR MODEL, this is one of the way to show the review data in Tours.
// we can also use the type and ref method in schema but that will create too many ids in the schema which will cause problem.
tourSchema.virtual('reviews', {
  // model which has a refernce with this one
  ref: 'Review',
  // is the actual name we have used in the schema as field to make the reference
  foreignField: 'tour',
  // what created the relationship reference between review and tour? answer: _id
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before save() and create() only
// THIS refer to document we just send that is not saved yet. this is why its called document middleware
tourSchema.pre('save', function (next) {
  // slugify librabry will give us a slug that can be used in url... so ==> my name is enayat =>> my-name-is-enayat
  this.slug = slugify(this.name, { lower: true });
  next();
});

// populate means fill out guides reference array with actual user data - as the guides field in tour model is
// just a reference and this will actualy help to populate the data.
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// if we wanted to use embadding method to add guides into tours model
// tourSchema.pre('save', async function (next) {
//   // bacause out map methos is using async therefore it will return promise so we need to await Promise.all(guidesPromises) to get the data
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
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

// We removed this because if was interfering with getDistances method in Tour controller
// AGGREGATION MIDDLEWARE:
// tourSchema.pre('aggregate', function (next) {
//   // in this case this.pipeline refers to all the aggregates we set for the two routes.
//   // here we dont want to show SECRET TOUR on aggregates as well.
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
