const mongoose = require('mongoose');
const Venue = require('./venueModel'); // Import the Venue model

const reservationSchema = new mongoose.Schema(
  {
    numberOfGuests: {
      type: Number,
      min: 1,
      required: [true, 'Please, tell us number of guests!'],
    },
    date: {
      type: Date,
      required: [true, 'Please, provide the date!'],
    },
    time: {
      type: String,
      required: [true, 'Please, provide the time!'],
    },
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

// Index to enforce uniqueness on venue, date, and time
reservationSchema.index({ venue: 1, date: 1, time: 1 }, { unique: true });

// Pre-save hook to ensure that:
// Reservations cannot be made for past times
// The venue's capacity is not exceeded for the same date
reservationSchema.pre('save', async function (next) {
  try {
    await validateReservationDate(this, next);
    await checkVenueCapacity(this, next);
  } catch (error) {
    next(error);
  }
});

// Validate that the reservation is not made for a past time.
async function validateReservationDate(reservation, next) {
  const now = new Date();
  const reservationDateTime = new Date(
    `${reservation.date.toISOString().split('T')[0]}T${reservation.time}:00`
  );

  if (reservationDateTime < now) {
    throw new Error('Reservations cannot be made for past times.');
  }
}

// Check if the total number of guests exceeds the venue's capacity.
async function checkVenueCapacity(reservation, next) {
  const venue = await Venue.findById(reservation.venue);
  if (!venue) throw new Error('Venue not found');

  const totalGuests = await calculateTotalGuests(reservation);

  if (totalGuests + reservation.numberOfGuests > venue.capacity) {
    throw new Error('The total number of guests exceeds the venue capacity for this date.');
  }
}

// Calculate the total number of guests already reserved for the same venue and date.
async function calculateTotalGuests(reservation) {
  const reservations = await reservation.constructor.aggregate([
    { $match: { venue: reservation.venue, date: reservation.date } },
    { $group: { _id: null, totalGuests: { $sum: '$numberOfGuests' } } },
  ]);

  return reservations.length > 0 ? reservations[0].totalGuests : 0;
}

// Populate the user field in findOneAndUpdate and findOneAndDelete operations
reservationSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
