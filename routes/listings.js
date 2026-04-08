const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../utils/validationSchema");
const { isOwner, isLoggedIn } = require("../middleware");
const listingController = require("../controllers/listings");

// validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// INDEX
router.get("/", wrapAsync(listingController.index));

router.get("/new", listingController.renderNewForm);

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.get("/:id", wrapAsync(listingController.showListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;