var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  mhajeb: String,
  msemen: String,
  bradj: String,
  kesra: String,
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  comment: String,
  date: { 
    type: Date, 
    required: true 
  }
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
