const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
var code = 0;
var login = false;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
  }
});
var remail = "test";
var rpass = "test";
//database connect
const uri = process.env.CONNECT;
mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connect(uri);
//database connect

let User = require('./users')
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
//kit_harington@gameofthron.es
//$2b$12$fDEu1Ru66tLWAVidMN.b0.929BlfnyqdGuhWMyzfOAf/ATYOyLoY6
const requirements = [/[^A-Za-z0-9@.]/, /^[^\s@]+@(gmail|outlook|yahoo|ymail|icloud)+.[^\s@]+$/i, /(.com|.org|.fr|.net)/i];
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

  remail = req.body.email;
  rpass = req.body.password;
  var test = await User.findOne({ email: remail });
  if(!test){
    res.render("login.ejs",{error:true})
  }
  else if (test.password == rpass && test.email == remail){
    res.render('welcome.ejs', { name: test.name, email: remail});
  } else {
    res.render("login.ejs",{error:true})
  }
})
app.get('/register', (req,res) => {
  res.render("register.ejs", {code:false, free:true, error:false});
})
app.post('/register', (req,res) => {
  remail = req.body.email;
  rpass = req.body.password;
  rname = req.body.name;
  if (Verifier(String(remail), 2) == true){
    code = Math.floor(Math.random() * (1000 - 900) + 1000);
    var mailOptions = {
      from: 'algeriangoods@gmail.com',
      to: remail,
      subject: 'Email Verification',
      text: "Here is your Email Verification code: " + String(code)
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
  if(code == req.body.code){
    User.create({ email: remail, password: rpass, name: rname }).then(result => { 
        console.log(result)
        res.render("login.ejs", {error:false});

    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//delete email@gmail.com, name - hh
//delete email, name
//delete email@hotmail.com, name
//delete email@, name
app.post('/start', (req, res) =>{
  res.render("login.ejs", {error:false});
})
app.post('/order', async (req, res) =>{
  var test = await User.findOne({ email: remail });
  var emailv = remail;
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