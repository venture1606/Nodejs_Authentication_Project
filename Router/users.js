const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    
    if (!name || !email || !password || !password2){
        errors.push({msg: 'Please fill all fields'});
    }

    if (password !== password2){
        errors.push({msg: 'Password do not match'});
    }

    if (password.length < 6){
        errors.push({msg: 'Atleast 6 character of password'});
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation pass
        User.findOne({email: email})
        .then(user => {
            if (user) {
                errors.push({msg: 'User already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });

            } else {
                const newUser = new User({
                    name,
                    email, 
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash; //crypted
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are passed now log in');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                    });
                });
                // console.log(newUser);
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'logged out');
        res.redirect('/users/login');
    });
})

module.exports = router;