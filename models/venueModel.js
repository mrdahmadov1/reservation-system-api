const mongoose = require('mongoose');
const slugify = require('slugify');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A venue must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A venue name must have less or equal than 40 characters'],
      minlength: [4, 'A venue name must have more or equal than 4 characters'],
    },
    capacity: {
      type: Number,
      required: [true, 'A venue must have a capacity'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A venue must have a description'],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

venueSchema.index({ slug: 1 });

// Virtual populate
venueSchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'venue',
  localField: '_id',
});

venueSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
