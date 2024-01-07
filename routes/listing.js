const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;

//NEW ROUTE
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
//
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(listingController.createListing)
);

// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync(listingController.editListing)
);

// index route
router.get("/", wrapAsync(listingController.index));

module.exports = router;
