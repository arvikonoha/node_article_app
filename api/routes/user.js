const express = require('express')
const route = express.Router();
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const expressValidator = require('express-validator')
const passport = require('passport')
route.use(expressValidator())

route.get('/register', (req,res) => {
  res.render('register')
})

route.post('/register',(req,res) => {
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username;
  const password = req.body.password
  
  req.checkBody('name','Name is required').notEmpty()
  req.checkBody('email','Email is required').notEmpty()
  req.checkBody('email','Email is not valid').isEmail()
  req.checkBody('username','Username is required').notEmpty()
  req.checkBody('password','Password is required').notEmpty()
  req.checkBody('cpassword','Passwords dot match').equals(password)

  let errors = req.validationErrors()
  if(errors) {
    res.render('register',{errors})
  } else {
    let newUser = new User({
      name,
      email,
      username,
      password
    })
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(newUser.password ,salt, (err,hash) => {
        if (err) console.log(err)
        else {
          newUser.password = hash
          newUser.save((err) => {
            if (err) console.log(err)
            else {
              req.flash('success','You are now registered and can login')
              res.redirect('/users/login')
            }
          })
        }
      })
    })
    
  }
})

route.get('/login',(req,res) => {
  res.render('login')
})

route.post('/login',(req,res,next) => {
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req,res,next)
})

route.get('/logout',(req,res) => {
  req.logout();
  req.flash('success', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = route