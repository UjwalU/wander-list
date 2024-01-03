const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//NEW ROUTE
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);
//
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, country, location } = req.body;
    let result = listingSchema.validate(req.body);
    let newListing = new Listing({
      title: title,
      description: description,
      image: image,
      price: price,
      country: country,
      location: location,
    });
    newListing.owner = req.user._id;
    await newListing.save().then(() => {
      console.log("saved");
    });
    req.flash("success", "New Listing Added !!");
    res.redirect("/listings");
  })
);

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing Not Found !!");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list });
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !!");
    res.redirect("/listings");
  })
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const list = await Listing.findById(id);
    res.render("./listings/edit.ejs", { list });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let {
      title: newTitle,
      description: newdesc,
      image: newImg,
      price: newPrice,
      country: newCountry,
      location: newLoc,
    } = req.body;
    let upList = await Listing.findByIdAndUpdate(id, {
      title: newTitle,
      description: newdesc,
      image: newImg,
      price: newPrice,
      country: newCountry,
      location: newLoc,
    });
    req.flash("success", "Listing Updated !!");
    res.redirect(`/listings/${id}`);
  })
);

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

module.exports = router;
