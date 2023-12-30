const mongoose = require("mongoose");
const initData = require("./data.js");
const ListingBNB = require("../models/listing.js");


const mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() =>{
    console.log("Connectes to DB");
}).catch(err =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_URL);
}

const initDB = async () =>{
    await ListingBNB.deleteMany({});
    await ListingBNB.insertMany(initData.data);
    console.log("Data Initialise");
}

initDB();