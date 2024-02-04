const ListingBNB = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema"); //JOi Schema for validation handling
module.exports.isLoggedIn = (req,res, next) =>{   
    //redirect URL SAVE
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged In !!");
        return res.redirect("/login");
       }
       next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//Listing Owner middleware
module.exports.isOwner =  async (req,res,next)=>{
    let { id } = req.params;
    let listing = await ListingBNB.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
      req.flash('error', 'You do not have permission to edit this listing');
      return res.redirect(`/listings/${id}`);
    }
    next();
};

//Review Author Middleware 
module.exports.isReviewAuthor =  async (req,res,next)=>{
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if(! review.author.equals(res.locals.currUser._id)){
    req.flash('error', 'You did not author to this review');
    return res.redirect(`/listings/${id}`);
  }
  next();
};


//Validate Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // If error occur map it to express Custom error and print it
    let errMsg = error.details.map((el) => el.message).join(","); //Join all error msg
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

//Validate Review
module.exports.validateReview = (req,res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}