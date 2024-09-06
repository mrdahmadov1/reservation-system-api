const Reservation = require('./../models/reservationModel');
const factory = require('./handlerFactory');

exports.setVenueUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.venue) req.body.venue = req.params.venueId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReservation = factory.getAll(Reservation);
exports.getReservation = factory.getOne(Reservation);
exports.createReservation = factory.createOne(Reservation);
exports.updateReservation = factory.updateOne(Reservation);
exports.deleteReservation = factory.deleteOne(Reservation);
