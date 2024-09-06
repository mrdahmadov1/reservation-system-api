const express = require('express');
const reservationController = require('./../controllers/reservationController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reservationController.getAllReservation)
  .post(
    authController.restrictTo('user'),
    reservationController.setVenueUserIds,
    reservationController.createReservation
  );

router
  .route('/:id')
  .get(reservationController.getReservation)
  .patch(authController.restrictTo('admin'), reservationController.updateReservation)
  .delete(authController.restrictTo('user', 'admin'), reservationController.deleteReservation);

module.exports = router;
