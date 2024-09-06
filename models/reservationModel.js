const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    numberOfGuests: {
      type: Number,
      required: [true, 'Please, tell us number of guests!'],
    },
    date: {
      type: Date,
      required: [true, 'Please, provide the date!'],
    },
    time: { type: String, required: [true, 'Please, provide the time!'] },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    venue: {
      type: mongoose.Schema.ObjectId,
      ref: 'Venue',
      required: [true, 'Reservation must belong to a venue.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

reservationSchema.index({ venue: 1, user: 1 }, { unique: true });

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username',
  });
  next();
});

// findByIdAndUpdate
// findByIdAndDelete
reservationSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
