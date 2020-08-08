const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportConfig = require('./config/passport-config')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const cors = require('cors');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRouter);

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

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

//CONNECT TO MONGODB-SERVER
const serverAdmin = process.env.ADMIN;
const accessKey = process.env.AUTH_KEY;
const database = process.env.DB;

// mongoose.connect('mongodb+srv://' + serverAdmin + ':' + accessKey + '@cluster0-1o0xw.mongodb.net/' + database + '?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useFindAndModify: true,
//   useUnifiedTopology: true,
// })
mongoose.connect(`mongodb + srv://jatin:llZxCr1b2mCnp3YR@cluster0.rpotc.mongodb.net/userdb?retryWrites=true&w=majority`, () => {
  console.log("connected to mongo db")
},
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }
);

mongoose.set('useCreateIndex', true)

//REGISTER-NEW-USER
// app.post('/register', function (req, res) {
//   User.register({ username: req.body.username }, req.body.password, function (err, user) {
//     if (err) {
//       console.log(err)
//       res.redirect('/register')
//     } else {
//       passport.authenticate('local')(req, res, function () {
//         res.redirect('/')
//       })
//     }
//   })
// });

//LOGIN-USER
// app.post('/login', function (req, res) {
//   const newUser = new User({
//     username: req.body.username,
//     password: req.body.password,
//   })

//   req.login(newUser, function (err) {
//     if (err) console.log(err)
//     else {
//       passport.authenticate('local')(req, res, function () {
//         res.redirect('/')
//       })
//     }
//   })
// });
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  else {
    res.status(401).json({
      isAuthenticated: false,
      message: "user has not been authenticated"
    });
  }
};

app.get('/', ensureAuthenticated, function (req, res) {
  res.send(200).json({
    isAuthenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});


app.listen(4000, () => console.log("sevice running on port 3000"));
