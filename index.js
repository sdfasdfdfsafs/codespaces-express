const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const requirements = [/[^A-Za-z0-9@.]/, /^[^\s@]+@(gmail|outlook|yahoo|ymail|icloud)+.[^\s@]+$/i, /(.com|.org|.fr|.net)/i];
var code = 0;
var login = false;
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

let Comment = require('./comments');
let User = require('./users')
app.get('/', (req, res) => {
  res.render("front.ejs");

})
//Olenna Tyrell
//diana_rigg@gameofthron.es

//kit_harington@gameofthron.es
//$2b$12$fDEu1Ru66tLWAVidMN.b0.929BlfnyqdGuhWMyzfOAf/ATYOyLoY6
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

  var email1 = req.body.email;
  var pass = req.body.password;
  var test = await User.findOne({ email: email1 });
  if(!test){
    res.render("login.ejs",{error:true})
  }
  else if (test.password == pass && test.email == email1){
    res.render('welcome.ejs', { name: test.name });
  } else {
    res.render("login.ejs",{error:true})
  }


  // if(email.toLowerCase() == comments[comments.indexOf(name.toLowerCase())].email){
  //   console.log("work")
  // }
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
app.get('/support', (req, res) =>{
  res.render("support.ejs");
})
//delete email@gmail.com, name - hh
//delete email, name
//delete email@hotmail.com, name
//delete email@, name
app.post('/start', (req, res) =>{
  res.render("login.ejs", {error:false});
})
app.post('/order', (req, res) =>{
  var food1 = req.body.food1;
  var food2 = req.body.food1;
  var food3 = req.body.food1;
  var food4 = req.body.food1;
  var extra = req.body.extra;
  console.log(food1 + extra)
})