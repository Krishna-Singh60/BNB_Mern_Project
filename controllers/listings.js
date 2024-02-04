const ListingBNB = require("../models/listing");

//Index controller
module.exports.index = async (req, res) => {
    const allListing = await ListingBNB.find({});
    res.render("listings/index.ejs", { allListing });
  }

  //new Form Controller
  module.exports.renderNewForm = (req, res) => {
    res.render("listings/newListing.ejs");
  }

  //Show Controller
  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await ListingBNB.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing is not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  //Create Listing Controller
  module.exports.createListing = async (req, res) => {
    //  let {title, description, image, price, country, location} = req.body; //Instead of, Will use key value pair from UI
    // let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new ListingBNB(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created Successfully !!");
    res.redirect("/listings");
  }

  //Edit Controller
  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await ListingBNB.findById(id);
    if(!listing){
      req.flash("error", "Listing you are requested does not exist");
      res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", { listing, originalImage });
  }

  //Update Controller
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await ListingBNB.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }
   
    req.flash("success", "Listing Updated !!");
    res.redirect(`/listings/${id}`);
  }

  //Delete/Detroy Controller
  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    // console.log({id});
    let deletedListing = await ListingBNB.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully !!");
    res.redirect("/listings");
  }