const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const ReviewController = require("../controllers/reviews"); //controllers mapped

// Post Review Route
router.post("/", isLoggedIn, validateReview,wrapAsync (ReviewController.createReview));
 
 // Delete Review Route
 router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

 module.exports = router;