const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../utils/validationSchema");
const reviewController = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

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
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,   // ✅ fixed
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;