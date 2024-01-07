const Listing = require("../models/listing.js");
const { listingSchema } = require("../Schema.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let { title, description, image, price, country, location } = req.body;
  let result = listingSchema.validate(req.body);
  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing({
    title: title,
    description: description,
    price: price,
    country: country,
    location: location,
  });
  (newListing.owner = req.user._id),
    (newListing.image = {
      url,
      filename,
    }),
    await newListing.save().then(() => {
      console.log("saved");
    });
  req.flash("success", "New Listing Added !!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing Not Found !!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { list });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted !!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const list = await Listing.findById(id);
  let originalImg = list.image.url;
  let neworiginalImg = originalImg.replace("/upload", "/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { list, neworiginalImg });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const {
    title: newTitle,
    description: newdesc,
    image: newImg,
    price: newPrice,
    country: newCountry,
    location: newLoc,
  } = req.body;

  let updateData = {
    title: newTitle,
    description: newdesc,
    price: newPrice,
    country: newCountry,
    location: newLoc,
  };

  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const upList = await Listing.findByIdAndUpdate(id, updateData);

  req.flash("success", "Listing Updated !!");
  res.redirect(`/listings/${id}`);
};
