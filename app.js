const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const { listingSchema, reviewSchema } = require("./utils/validationSchema");
const Review = require("./models/review");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
 .then(() =>{
    console.log("connected to db");
 })
 .catch((err) =>{
    console.log(err);
 });

 async function main(){
    await mongoose.connect(MONGO_URL);
 }

 app.engine("ejs", ejsMate);
 app.set("view engine", "ejs");
 
 app.set("views",  path.join(__dirname, "views"));
 console.log(path.join(__dirname, "views"));
 app.use(express.urlencoded({extended: true}));
 app.use(methodOverride("_method"));
 app.use(express.static(path.join(__dirname, "public")));

 const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);





app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err});
});



app.listen(8080, () =>{
    console.log("server is listening");
});

