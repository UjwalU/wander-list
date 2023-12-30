const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const MongoUrl = "mongodb://127.0.0.1:27017/wonderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const Review = require("./models/review.js");

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MongoUrl);
}

app.get("/", (req, res) => {
  res.send("hii i amroot");
});

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.post("/listings/:id/reviews",wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

//NEW ROUTE
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);
//
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, country, location } = req.body;
    let result = listingSchema.validate(req.body);
    console.log(result);
    let newListing = new Listing({
      title: title,
      description: description,
      image: image,
      price: price,
      country: country,
      location: location,
    });
    await newListing.save().then(() => {
      console.log("saved");
    });
    res.redirect("/listings");
  })
);

// SHOW ROUTE
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("./listings/show.ejs", { list });
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const list = await Listing.findById(id);
    res.render("./listings/edit.ejs", { list });
  })
);

app.put(
  "/listings/:id",
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
    res.redirect(`/listings/${id}`);
  })
);

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found !"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;

  res.status(status).render("./listings/error.ejs", { err, status });

  // res.status(status).send(message);
});



app.listen(8080, () => {
  console.log("server is listening on 8080");
});
