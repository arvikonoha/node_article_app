const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../config/database')

module.exports = function(passport){

  passport.use(new LocalStrategy(function(username,password,done){
    let querry = {username:username}
    User.findOne(querry,function(err,user){
      if(err) console.log(err)
      if(!user) return done(null,false,{message: 'No user found'})

      bcrypt.compare(password, user.password , function(err, isMatch){
        if(err)
          console.log(err)
        if(isMatch)
          return done(null,user)
        else
          return done(null,false,{message: 'Wrong password'})
      } )
    })
  }))

  passport.serializeUser(function(user,done){
    done(null,user._id)
  })

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      if(err) console.log(err)
      done(err,user)
    })
  })
}
