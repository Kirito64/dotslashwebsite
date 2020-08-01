const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const AuthController = require('./controllers/AuthController.js')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

//SIGN-IN-WITH-GOOGLE
app.get('/auth/google', AuthController().GoogleOAuth())
app.get('/auth/google/dotslash', AuthController().GoogleOAuthdotslash(res, req))
//LOGOUT-USER
app.get('/logout', AuthController().Logout(req, res))
//REGISTER-NEW-USER
app.post('/register', AuthController().RegisterNewUser(req, res))
//LOGIN-USER
app.post('/login', AuthController().LoginUser(req, res))

module.exports = app
