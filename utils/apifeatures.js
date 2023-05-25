class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // here we are using mongoose builtin filtering, gte = greater or equal, gt=greater, lte=less than or equal, lt=less than.
    // localhost:3000/api/v1/tours?duration[gte]=5&&price[lt]=1500 => show durations greater or equal to 5 and price less than 1500
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      // in case we have more than one sort creteria we want to first take both an devide them by coma(,) then combine them together
      // localhost:3000/api/v1/tours?sort=-price,ratingsAverage, sort it by price and ratingsAverage... we cant write them with space to we use comma
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // incase no sorting createria, sort it by when it was created
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3) Field limiting
    if (this.queryString.fields) {
      // localhost:3000/api/v1/tours?fields=name,duration,difficulty show only field name, duration difficulty
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;
