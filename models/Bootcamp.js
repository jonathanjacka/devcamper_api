const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name must be 50 characters or fewer'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be longer than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can no longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false, //TODO: change this when location is generated
      },
      coordinates: {
        type: [Number],
        required: false, //TODO: change this when location is generated
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create bootcamp slug from name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode & create location field
BootcampSchema.pre('save', async function (next) {
  const location = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  };

  //Do not save user-entered address as we're using generated one
  this.address = undefined;
  next();
});

//Cascade delete courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  console.log(`Courses being removed from bootcamp: ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
