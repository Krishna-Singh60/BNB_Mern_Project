const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ListingBNB = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({ storage});

const listingController = require("../controllers/listings");

// Index route  & // // Create Route
router.route("/")
.get(wrapAsync(listingController.index))   //isLoggedIn, validateListing,
.post(isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.createListing));


// New (Add) Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Show Route  &&  // Update Route && //Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
