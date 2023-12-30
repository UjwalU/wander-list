const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1419924285/photo/concept-of-new-ideas-and-innovation.jpg?s=612x612&w=0&k=20&c=7BOwaAIzoSEdxLvkoXkcxibxAiL_NoYj_gdjxRiECU0=",
    set: (v) =>
      v === ""
        ? "https://media.istockphoto.com/id/1419924285/photo/concept-of-new-ideas-and-innovation.jpg?s=612x612&w=0&k=20&c=7BOwaAIzoSEdxLvkoXkcxibxAiL_NoYj_gdjxRiECU0="
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
