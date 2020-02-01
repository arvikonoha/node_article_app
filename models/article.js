const mongoose = require('mongoose')
const articleschema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  auther:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
})

let Article = module.exports = mongoose.model('Article',articleschema)
