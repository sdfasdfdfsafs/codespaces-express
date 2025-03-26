// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

var userSchema = new Schema({
  name: String,
  email: String,
  password: String
})
//attach schema to model

var User = mongoose.model('User', userSchema);
// make this available to our users in our Node applications

module.exports = User;