const express = require("express");
const router = express.Router();

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// SIGNUP FORM
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// SIGNUP LOGIC
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, password } = req.body;

        const newUser = new User({ username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to RenttIt!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("users/login");
});

// LOGIN LOGIC
router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;