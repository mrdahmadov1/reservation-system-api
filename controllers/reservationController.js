const Reservation = require('./../models/reservationModel');
const factory = require('./handlerFactory');

exports.setVenueUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.venue) req.body.venue = req.params.venueId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getMyReservations = (req, res, next) => {
  // Dynamically build the filter and call the factory function
  req.query.user = req.user._id;
  factory.getAll(Reservation)(req, res, next);
};

exports.getAllReservation = factory.getAll(Reservation);
exports.getReservation = factory.getOne(Reservation);
exports.createReservation = factory.createOne(Reservation);
exports.deleteReservation = factory.deleteOne(Reservation);
