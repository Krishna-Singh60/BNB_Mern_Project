const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ListingBNB = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
PORT = 8080;

const mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() =>{
    console.log("Connectes to DB");
}).catch(err =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_URL);
}

app.set("View engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req,res) =>{
    res.send("Hi I Buddy");
})
// Index route
app.get("/listings", async (req, res) =>{
 const allListing = await ListingBNB.find({})
 res.render("listings/index.ejs", {allListing});
});

// New Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/newListing.ejs");
})

// Create Route
app.post("/listings", async (req,res) =>{
//  let {title, description, image, price, country, location} = req.body;  Will use key value pair from UI
// let listing = req.body.listing;
// console.log(listing);
const newListing = new ListingBNB(req.body.listing);
await newListing.save();
res.redirect("/listings");
})
// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
let {id} = req.params;
 const listing = await ListingBNB.findById(id);
 res.render("listings/edit.ejs", {listing});
})
// Update Route
app.put("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    await ListingBNB.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
//Delete Route
app.delete("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await ListingBNB.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
})
//Show Route
app.get("/listings/:id", async (req, res) =>{
 let {id} = req.params;
 const listing = await ListingBNB.findById(id);
 res.render("listings/show.ejs", {listing});
})

// app.get("/testing", async (req,res) =>{
//     let sampleListing = new ListingBNB({
//         title : "My Home",
//         description : "Beach",
//         price : 1200,
//         location : "Goa",
//         Country : "India",
//     })
//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Done");
// })
app.listen(PORT, () =>{
    console.log(`server is running on ${PORT}`);
})