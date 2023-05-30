var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');

const localStrategy = require("passport-local")

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// register a usre

router.post("/register", function (req, res) {
  const userData = new userModel({
    name: req.body.name,
    username: req.body.username
  })
  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect("/profile");
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send("user phele se hai bhaya");
    })
});

//make route for login page

router.get("/login", function (req, res) {
  res.render("login");
})

router.get("/profile", isLoggedIn, async function (req, res) {
  const foundUser = await userModel
  .findOne({ username: req.session.passport.user })
  console.log(foundUser);
  res.send(foundUser)
})

//function to check if the user is logedin

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/")
}

router.get('/check/:username', async function (req, res, next) {
  let user = await userModel.findOne({username: req.params.username})
  res.json({user})
});

module.exports = router;
