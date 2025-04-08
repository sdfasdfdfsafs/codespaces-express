const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
var login = false;
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();
let User = require('./users')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
  }
});
app.use(session({
  secret: "codetestgeneration123",
  resave: false,
  saveUninitialized: true
}));
mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connect(uri);
const uri = process.env.CONNECT;
//database connect
let Order = require('./orders')
app.get('/', (req, res) => {
  res.render("front.ejs");

})
app.get('/admin', (req, res)=>{
  res.render('admin.ejs', {error: false});
})

app.post('/admin', async (req, res)=>{
  var em = req.body.email;
  var ps = req.body.password;
  var test = await User.findOne({ email: em });
  if(!test){
    res.render("admin.ejs",{error:true})
  }
  else if (test.password == ps && test.email == em && String(test.email) == process.env.ADMIN){
    const orders = await Order.find().sort({ date: 1 });
    res.render('list.ejs', {Order: orders});
  } else {
    res.render("admin.ejs",{error:true})
  }
})
app.post('/deleteOrder', async (req, res)=>{
  var id = req.body.id
  const del = await Order.findByIdAndDelete(id);
  const orders = await Order.find().sort({ date: 1 });
  res.render('list.ejs', {Order: orders});
})
req.session.email = "test";
req.session.pass = "test";
const requirements= [/[^A-Za-z0-9@.]/, /^[^\s@]+@(gmail|outlook|yahoo|ymail|icloud)+.[^\s@]+$/i, /(.com|.org|.fr|.net)/i];
function Verifier(email, req){
  if (req == 0){
    if (email.match(requirements[req]) === null){
      return true;
    }
    return false;
  }
  if (email.match(requirements[req]) != null){
    return Verifier(email, req - 1);
  }
  console.log("work!")
  return false;
}

app.post('/login', async (req,res) => {
  req.session.email = req.body.email;
  req.session.pass = req.body.password;
  var test = await User.findOne({ email: req.session.email });
  if(!test){
    res.render("login.ejs",{error:true})
  }
  else if (test.password == req.session.pass && test.email == req.session.code){
    res.render('welcome.ejs', { name: test.name, email: req.session.email});
  } else {
    res.render("login.ejs",{error:true})
  }
})
const session = require('express-session');

app.get('/register', (req,res) => {
  res.render("register.ejs", {code:false, free:true, error:false});
})






app.post('/register', (req,res) => {
  req.session.email = req.body.email;
  req.session.pass = req.body.password;
  rname = req.body.name;
  if (Verifier(String(req.session.email), 2) == true){
    req.session.code = Math.floor(Math.random() * (1000 - 900) + 1000);
    var mailOptions = {
      from: 'algeriangoods@gmail.com',
      to: req.session.email,
      subject: 'Email Verification',
      text: "Here is your Email Verification code: " + String(req.session.code)
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render("register.ejs", {code:true, free:false, error:false});
  }else{

    res.render("register.ejs", {code:false, free:true, error:true});
  }
})
app.post('/code', (req, res) => {
  //User.create({ email: req.body.email, password: req.body.password, name: req.body.name }).then(result => { 
  //  console.log(result)
  //})
  if(req.session.code == req.body.code){
    User.create({ email: req.session.email, password: req.session.pass, name: rname }).then(result => { 
        console.log(result)
        res.render("login.ejs", {error:false});

    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.post('/start', (req, res) =>{
  res.render("login.ejs", {error:false});
})
app.post('/order', async (req, res) =>{
  var test = await User.findOne({ email: req.session.email });
  var emailv = req.session.email;
  var mhajebv = req.body.food1;
  var msemenv = req.body.food2;
  var bradjv = req.body.food3;
  var kesrav = req.body.food4;
  var extra = req.body.extra;
  var datev = req.body.date;
  Order.create({ mhajeb: mhajebv, msemen: msemenv, bradj: bradjv, kesra: kesrav, name: test.name, comment: extra, date: datev, email: emailv }).then(result => {
    console.log(result)
    res.render('back.ejs');
  })
})