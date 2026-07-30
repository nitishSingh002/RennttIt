const path = require("path");
console.log("Current directory:", __dirname);
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

const mongoose = require("mongoose");
const Listing = require("../models/listing");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => console.log("Connected"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}

async function updateCategory(){

    await Listing.updateMany(
        {},
        {
            $set:{
                category:"Trending"
            }
        }
    );

    console.log("Updated Successfully");
    mongoose.connection.close();
}

updateCategory();