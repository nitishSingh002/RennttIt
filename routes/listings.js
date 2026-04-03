const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../utils/validationSchema");
const { isOwner, isLoggedIn } = require("../middleware");

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
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// NEW
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// CREATE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews").populate("owner");

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show", { listing });
}));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

// UPDATE
router.put("/:id",isLoggedIn,
    isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listing;

    if (updatedData.image.url === "") {
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id",  isLoggedIn,
    isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;