
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var orderSchema = new Schema({
  mhajeb: String,
  msemen: String,
  bradj: String,
  kesra: String,
  email: String,
  name: String,
  comment: String,
  date: { type: Date, required: true}
})
//attach schema to model

var Order = mongoose.model('Order', orderSchema);
// make this available to our users in our Node applications

module.exports = Order;