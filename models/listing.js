const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
       type : String,
       required : true,
    },
    description : String,
    image : {
       type : String,
       default : "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
       set : (v) => v === "" ? "https://unsplash.com/photos/a-blurry-picture-of-a-bridge-with-a-car-passing-by-QWK3xmUThYU" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const ListingBNB = mongoose.model("ListingBNB", listingSchema);
module.exports = ListingBNB;