const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../utils/validationSchema");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.post("/",
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id; 
        
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "Review added!");
        res.redirect(`/listings/${listing._id}`);
    })
);

router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });

        await Review.findByIdAndDelete(reviewId);
        
        req.flash("success", "Review deleted!");
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;