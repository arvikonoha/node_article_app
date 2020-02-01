// backend framework installed as dev dependancy
const express = require('express')

// node core library
const path = require('path')

// third party mongo library for mongodb
const mongoose = require('mongoose')

// Mongoose schema that we created seperately
const Article = require('./models/article')

// /articles route that we created in a different route
const article = require('./api/routes/article')

// user route
const user = require('./api/routes/user')

// express session to persist the user data
const session= require('express-session')

const passport = require('passport')

// middleware needed for showing flash messages
const flash = require('connect-flash')
const app = express()

// a middleware that parses the request body
app.use(express.json())
// this makes sure that urlenencoded data is parsed as well
app.use(express.urlencoded({extended:false}))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// this is how we can set a file path as a static folder to serve
app.use(express.static(path.join(__dirname,'public')))


const config = require('./config/database.js')
// this is how you connect to a mongo service you your local machine nodekb collection in perticular, {useNewUrlParser:true} this is done because url parser for mongo is deprecated and we have use the newer vesion of that
mongoose.connect(config.database,{useNewUrlParser:true})

// the connection made above returned as an object to work with
let db = mongoose.connection

// Check connections ( open event )
db.once('open', () => console.log('Connected to mongodb'))

// Check for db errors (err event)
db.on('error', err => console.log(err))

// load view engine engine identifier aand its path
app.set('views',path.join(__dirname,'views'))

// and the engine type and the name of the engine
app.set('view engine','pug')

require('./config/passport')(passport)

app.use(passport.initialize())
app.use(passport.session())

app.get('*', function(req,res,next){
  res.locals.user = req.user || null;
  next();
})

// home route
app.get('/', (req,res) => {
  // Article is a schema
  // there is no querry takes a callback and error must be handled
  Article.find({}, (err, articles) => {
    if (err) console.log(err)
    else res.render('index', {title: "Article",articles})
    // render renders the view and takes the data in an object form as second parameter
  })
})

app.use('/articles', article)
app.use('/users', user)

const PORT = process.env.PORT || 5000

// start server
app.listen(PORT , () => console.log(`Server started on port ${PORT}`))