const serverAdmin = process.env.ADMIN
const accessKey = process.env.AUTH_KEY
const database = process.env.DB
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const findOrCreate = require('mongoose-findorcreate')

mongoose.connect(
  'mongodb+srv://' +
    serverAdmin +
    ':' +
    accessKey +
    '@cluster0-1o0xw.mongodb.net/' +
    database +
    '?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }
)
mongoose.set('useCreateIndex', true)

//USERS-COLLECTION-SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
})

const AuthController = () => {
  //SALT-USER-PASSWORD-AND-MORE-WITH-PASSPORT-PLUGIN
  userSchema.plugin(passportLocalMongoose)
  userSchema.plugin(findOrCreate)

  //USER-DATA-MODEL
  const User = new mongoose.model('user', userSchema)

  //LOCAL-LOGIN-STRATEGY-AND-COOKIES
  passport.use(User.createStrategy())
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
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
      (accessToken, refreshToken, profile, cb) => {
        // console.log(profile);
        User.findOrCreate(
          { googleId: profile.id, email: profile.email },
          (err, user) => {
            return cb(err, user)
          }
        )
      }
    )
  )

  //SIGN-IN-WITH-GOOGLE
  const GoogleOAuth = () =>
    passport.authenticate('google', { scope: ['profile'] })

  const GoogleOAuthdotslah = () => {
    passport.authenticate('google', {
      failureRedirect: '/login',
      successRedirect: '/',
    })
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
          passport.authenticate('local')(req, res, () => {
            res.redirect('/')
          })
        }
      }
    )
  }

  //LOGIN-USER
  const LoginUser = (req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    })

    req.login(newUser, (err) => {
      if (err) console.log(err)
      else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/')
        })
      }
    })
  }

  return {
    GoogleOAuth,
    GoogleOAuthdotslah,
    Logout,
    LoginUser,
    RegisterNewUser,
  }
}

module.exports = AuthController
