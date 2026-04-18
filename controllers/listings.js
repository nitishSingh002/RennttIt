const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");


// INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// SHOW
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

     // 👇 Cloudinary image
      if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        // fallback (optional)
        newListing.image = {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            filename: "default"
        };
    }


    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

// UPDATE
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listing;

    if (updatedData.image.url === "") {
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
};