const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

// 2) ROUTES HANDLERS

router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTour);
router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

// router
//   .route("/")
//   .get(tourController.getAllTours)
//   .post(tourController.createTour);
// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
