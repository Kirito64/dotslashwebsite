const router = require('express').Router();
const passport = require('passport');
const ClientURL = 'http://localhost:3000';

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

router.get('/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

router.get('/google/dotslash',
    passport.authenticate('google', {
        failureRedirect: '/auth/login/failed',
        successRedirect: ClientURL
    }),

);

//LOGOUT-USER
router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
});



module.exports = router;