require('dotenv').config()
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const serverAdmin = process.env.ADMIN
const accessKey = process.env.AUTH_KEY
const database = process.env.DB

const User = require('../models/User')

mongoose.connect(
  'mongodb+srv://jatin:JATINasdf@cluster0.rpotc.mongodb.net/userdb?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }
)

mongoose.set('useCreateIndex', true)

//USERS-COLLECTION-SCHEMA

//SALT-USER-PASSWORD-AND-MORE-WITH-PASSPORT-PLUGIN
userSchema.plugin(passportLocalMongoose)
//USER-DATA-MODEL

//LOCAL-LOGIN-STRATEGY-AND-COOKIES
passport.use(User.createStrategy())
passport.serializeUser(function (user, done) {
  done(null, user.id)
})
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

//GOOGLE-SIGN-IN-STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // TODO: EDIT_URL_FROM_LOCAL_HOST_TO_ACTUAL_DOMAIN_AS_PER_YOUR_API_CREDENTIALS
      callbackURL: 'http://localhost:3000/auth/google/dotslash',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }, function (err, user) {
        if (err) return done(err)
        if (user) return done(null, user)
        else {
          var newUser = new User({
            googleId: profileData.sub,
            firstName: profileData.given_name,
            lastName: profileData.family_name,
            email: profileData.email,
            verified: profileData.email_verified,
            picture: profileData.picture,
            language: profileData.locale,
          })

          newUser.save(function (err) {
            if (err) throw err
            return done(err, newUser)
          })
        }
      })
    }
  )
)

const AuthController = () => {
  const GoogleOAuth = () => {
    return passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    })
  }

  const GoogleOAuthdotslash = (res, req) => {
    passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
        // SUCCESSFUL-AUTHENTICATION-REDIRECT-HOME
        res.redirect('/')
      }
  }
  //LOGOUT-USER
  const Logout = (req, res) => {
    req.logout()
    res.redirect('/')
  }

  //REGISTER-NEW-USER
  const RegisterNewUser = (req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err)
          res.redirect('/register')
        } else {
          passport.authenticate('local')(req, res, function () {
            res.redirect('/')
          })
        }
      }
    )
    return res.status(200).json(req.body.username)
  }

  //LOGIN-USER
  const Login = (req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    })

    req.login(newUser, function (err) {
      if (err) console.log(err)
      else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/')
        })
      }
    })
  }

  return {
    GoogleOAuth,
    GoogleOAuthdotslash,
    Logout,
    RegisterNewUser,
    Login,
  }
}

module.exports = AuthController()
