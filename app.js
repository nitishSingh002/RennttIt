const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

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



app.get("/", (req,res)=> {
    res.send("Hi");
});

//index route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//saves data
app.post("/listings", wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
app.get("/listings/:id", wrapAsync(async (req,res,next) => {
    let { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ExpressError(400, "Invalid ID");
}

const listing = await Listing.findById(id);

    if(!listing){
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show", { listing });
}));

//Edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ExpressError(400, "Invalid ID");
}

const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    let updatedData = req.body.listing;

    // prevent empty image URL from deleting old image
    if(updatedData.image === ""){
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData);

    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


app.listen(8080, () =>{
    console.log("server is listening");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});