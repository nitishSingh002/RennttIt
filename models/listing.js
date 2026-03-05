const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    description: String,
    image: {
        type: String,
       // filename: String,
      //  url: String,
        default: "https://unsplash.com/photos/lone-tree-silhouetted-on-a-hill-at-sunset--Fr4DhM0ge8",
        set: (v) => v=== "" ? "https://unsplash.com/photos/lone-tree-silhouetted-on-a-hill-at-sunset--Fr4DhM0ge8": v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
