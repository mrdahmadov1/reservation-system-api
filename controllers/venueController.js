const factory = require('./handlerFactory');
const Venue = require('./../models/venueModel');

exports.getAllVenue = factory.getAll(Venue);
exports.getVenue = factory.getOne(Venue, { path: 'reservations' });
exports.createVenue = factory.createOne(Venue);
exports.updateVenue = factory.updateOne(Venue);
exports.deleteVenue = factory.deleteOne(Venue);
