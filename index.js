const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport=require('passport')
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
const dbUri = process.env.db;

app.set('trust proxy', 1); 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: process.env.NODE_ENV === 'production' }
})); 

app.use(express.json());



const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID:process.env.client_Id, 
    clientSecret: process.env.client_secret,
    callbackURL: "http://localhost:3232/api/v1/google/callback"
  },
  function(req,accessToken, refreshToken, profile, cb) {
    
    

      return cb(null, profile);
    
  }
)); 

passport.serializeUser((user, done) =>{
  done(null, user);
}); 

passport.deserializeUser((user, done)=> {
  
    done(null, user);
  });

  app.use(passport.initialize())
  app.use(passport.session()) 


app.use("/api/v1/", require('./route/userRoute'));
app.listen(port, () => {
    console.log(`app is up and running on port:${port}`);
});

mongoose.connect(dbUri)
    .then(() => {
        console.log('connected to the Database');
    })
    .catch((err) => {
        console.error(err.message); 
    });
