const ListingBNB = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {

    let listing = await ListingBNB.findById(req.params.id);
    let newReview = new Review(req.body.review); //pass in backend
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview); 
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added Successfully !!");
    res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview = async (req,res,next) =>{
    let {id, reviewid} = req.params;  //fetching listing id or review id from query
    await ListingBNB.findByIdAndUpdate(id, {$pull : {reviews : reviewid}}); //pull review id and update in Listing table
    const reviews =  await Review.findByIdAndDelete(reviewid); //find reviewId and remove from review table
    req.flash("success", "Review Deleted Successfully !!");
    res.redirect(`/listings/${id}`);
}