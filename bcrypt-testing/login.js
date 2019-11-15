const express = require("express");
const app = express();
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const Movies = require("./models/Movies");
const Users = require("./models/User");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const PORT = 3000;

mongoose
  .connect("mongodb://localhost/movies", { useNewUrlParser: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/signup", (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);

  Users.findOne({ name: req.body.username }).then(userFound => {
    if (userFound !== null) {
      res.json({ authorised: false, reason: "User exists" });
    } else {
      Users.create({ name: req.body.username, password: hash })
        .then(userCreated => {
          res.json({ created: true, userCreated });
        })
        .catch(() => {
          res.json({ created: false });
        });
    }
  });
});

app.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });

app.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/login");
  }
});

app.post("/login", (req, res) => {
  function notFound(reason) {
    res.json({ authorised: false, reason });
  }
  Users.findOne({ name: req.body.username })
    .then(userFound => {
      // res.json({userFound})
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        //continue login
        req.session.currentUser = userFound._id;
        res.redirect("/private");
        // res.json({ authorised: true });
      } else {
        notFound("password or user are wrong");
      }
    })
    .catch(userNotFoundError => {
      notFound("user not found");
    });
});

app.listen(PORT, () => console.log("running"));
