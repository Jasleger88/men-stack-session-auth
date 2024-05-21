const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const app = express ();
const session = require("expression-session");

const mongoose = require('mongoose')
const methodOverride = require('method-override');
const morgan = require('morgan');

//import the auth controller
const authController = require("./controllers/auth.js");

const port = process.env.PORT ? process.env.PORT : 3000;
mongoose.connect(process.env.MONGODB_URI);
console.log(port);

//connect to database
// what we want to happen after we connect

mongoose.connection.on('connected', ()=> {
    console.log(`connected to MongoDB ${mongoose.connection.name}.`);
});
//middleware to parese incoming request URl-encoded data from forms

app.use(express.urlencoded({extended: false}));

//middleware for using HTTP verbs such as PUT or DELETE in places where the clinet doesnt support it 

app.use(methodOverride('_method'));


//morgan for loggin HTTP request
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitalized: true,
})
);

//use the auth controller for any requests that start with /auth
app.use('/auth', authController);

//set up a get request route

app.get("/", async (req, res) => {
    res.render("index.ejs", {user: req.session.user});
})

//listen for incoming request
app.listen(port, ()=> {
    console.log(`The express app is ready on port ${port}!`);
});

