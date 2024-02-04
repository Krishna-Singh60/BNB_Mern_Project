if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingsRoutes = require("./routes/listing"); //
const reviewsRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

//MOngo DB onnection
PORT = 8080;
// const mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";
const atlsDBUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connectes to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(atlsDBUrl);
}

app.set("View engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//mongo session
const store = MongoStore.create({
  mongoUrl : atlsDBUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 12 * 3600,
})

store.on("error", () =>{
  console.log("Session error", err);
})

//session
const sessionOption = {
  store : store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


//Session setup 
app.use(session(sessionOption));
app.use(flash());

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Router Setup 
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

//Wild Card entry Error handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Global Middle handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { message });
});

//App. listner
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
