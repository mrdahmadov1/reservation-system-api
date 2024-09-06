const express = require('express');
const authController = require('./../controllers/authController');
const venueController = require('./../controllers/venueController');

const router = express.Router();
router
  .route('/')
  .get(venueController.getAllVenue)
  .post(authController.protect, authController.restrictTo('admin'), venueController.createVenue);

router
  .route('/:id')
  .get(venueController.getVenue)
  .patch(authController.protect, authController.restrictTo('admin'), venueController.updateVenue)
  .delete(authController.protect, authController.restrictTo('admin'), venueController.deleteVenue);

module.exports = router;
