const express = require('express')
const route = express.Router();
const Article = require('../../models/article')
const expressValidator = require('express-validator')
route.use(expressValidator())

route.get('/add', (req,res) => {
  res.render('add_article', {title: "Add Article"})
})

// Add submit post route
route.post('/add', (req,res) => {
  // Create a new article using the schema from req.body which was parsed earlier

  req.checkBody('title','Article must have a title').notEmpty()
  req.checkBody('auther','Article must have a auther').notEmpty()
  req.checkBody('body','Article must have a body').notEmpty()

  const errors = req.validationErrors()
  if(errors)
  {
    res.render('add_article',{
      title: 'Add Article',
      errors
    })
  }
  else{
    let article = new Article();
    article.title = req.body.title;
    article.auther = req.body.auther;
    article.body = req.body.body;
    // save method does that and takes a possible error
    article.save( (err) => {
      if (err)
        console.log(err)
      else{
        req.flash('success','Article Added')
        res.redirect('/')
      }
    })
  }
})

route.get('/:id', (req,res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err)
    } else {
      res.render('article', {article})
    }
  })
})

route.get('/edit/:id', (req,res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err)
    } else {
      res.render('edit_article', {title:'Edit Article',article})
    }
  })
})

route.post('/edit/:id', (req,res) => {
  // Create a new article using the schema from req.body which was parsed earlier
  let article = {}
  article.title = req.body.title;
  article.auther = req.body.auther;
  article.body = req.body.body;
  // save method does that and takes a possible error
  Article.updateOne({_id: req.params.id},article, (err) => {
    if (err)
      console.log(err)
    else
      req.flash('success','Article Updated')
      res.redirect('/')
  })
})

route.delete('/:id', (req,res) => {
  Article.deleteOne({_id:req.params.id},(err) => {
    if (err) console.log(err)
    else res.send('Success')
  }) 
})

module.exports = route