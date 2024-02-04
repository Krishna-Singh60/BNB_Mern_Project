const mongoose = require("mongoose");
const initData = require("./data.js");
const ListingBNB = require("../models/listing.js");


const atlsDBUrl = "mongodb+srv://krishnasingh:Ws9ap2mSosk1p4UL@cluster0.q2rgm7j.mongodb.net/?retryWrites=true&w=majority"

main().then(() =>{
    console.log("Connectes to DB");
}).catch(err =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(atlsDBUrl);
}

const initDB = async () =>{
    await ListingBNB.deleteMany({}); //remove existing
    initData.data = initData.data.map((obj) => ({...obj, owner : "65bff486feb98e466de06916"})) //map new listing 
    await ListingBNB.insertMany(initData.data); //add new listing
    console.log("initilized Data");
}

initDB();