const express = require("express");
const router = express.Router();
const bcrupt = require("bcrypt")
const User = require("../models/user.js");

router.get('/sign-up', (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req,res) => {
    // your code here; user will send us the username, password, and password confirmation
    //we need to check if the user name is already taken 
    //check if the password and passworConfrimation are the same
    //do ay password validation you want

    const userInDatabase = await User.findOne({username: req.body.username});
        if (userInDatabase) {
            return res.send("Username already taken.");
        }

    if(req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords don't match.");
        }
   
    const hasUpperCase = /[A-Z]/.test(req.body.password);
    if (!hasUpperCase) {
        console.log(req.body.password)
        return res.send("Password must containat least one Uppercase Letter")
    }
    if(req.body.password.length < 8) {
        return res.send("Password must be at least 8 characters long");
    }
    const hashedPassword = bcrupt.hashSync(req.body.password, 10);
   
    req.body.password = hashedPassword;
    
    const user = await User.create(req.body);
    res.send(`Thanks for Signing up ${user.username}`);
});


module.exports = router;
