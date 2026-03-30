const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        },
        filename: String
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;