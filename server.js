const express = require('express')
const fs = require('fs')
const app = express()
var pathe = require('path')
const multer = require('multer')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const JWT_SECRET = ';oidhjf;lkdahjsj li;furqw[oitvufenoioungfoisaud[oifusao;+'


//multer file storage and stuff
var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./userFiles");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("file"); //Field name and max count

//end multer stuff here

app.use(express.static(pathe.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true
}))


mongoose.connect('mongodb://localhost:27017/AuthAppDB',{
  useNewUrlParser:true,
  useUnifiedTopology:true
});


app.set("view engine", "ejs")
app.get('/', async (req,res) => {

    res.render("login")
})



app.post("/signin", async (req,res) => {

  const {email,password} = req.body
  const user = await User.findOne({email}).lean()
  if(!user){
    return res.json({status:'error', error: 'Invalid username'})
  }
  if(await bcrypt.compare(password, user.password)){
    //email password combination successful
    const token = jwt.sign({
      id: user._id,
      username: user.username
    }, JWT_SECRET)
    normAuth = true;
    UserInfo.name = user.username;
    UserInfo.id = user._id;
    return res.json({status:'ok', data: token})
  }
    return res.json({status:'error', error: 'Invalid password'})
})

app.get('/Register', (req,res) => {
  res.render("Register")
})

app.post("/signup",async (req,res)=>{
  console.log(req.body)
  const {username, email, password: plainTextPassword, bday, phonenumber} = req.body

  if(!username || typeof username != 'string'){
    return res.json({ status: 'error', error: 'Invalid Username'})
  }

  if(!email || typeof email != 'string'){
    return res.json({ status: 'error', error: 'Invalid email'})
  }

  if(!plainTextPassword || typeof plainTextPassword != 'string'){
    return res.json({ status: 'error', error: 'Invalid password'})
  }

  if(!bday || typeof bday != 'string'){
    return res.json({ status: 'error', error: 'Invalid password'})
  }

  if(!phonenumber || typeof phonenumber != 'string'){
    return res.json({ status: 'error', error: 'Invalid password'})
  }

  if(plainTextPassword.length < 5){
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters long'
    })
  }

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      email,
      password,
      bday,
      phonenumber
    })
    console.log('User Created Successfully: ', response)
  } catch (error) {
    if(error.code === 11000){
      //duplicate key
      return res.json({status:'error', error: 'Email already in use'})
    }
    throw error
  }
  console.log(await bcrypt.hash(password, 10))

  res.json({ status: 'ok' })

})

app.listen(3000, () => {
  console.log("App started on port 3000")
})
