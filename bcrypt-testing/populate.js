const mongoose = require("mongoose");
const User = require("./models/User");
const Car = require("./models/Car");

function checkUser() {
  Car.find()
    .populate("owner")
    .then(carData => {
      console.log(carData);

      process.exit(0)
    });
}

mongoose
  .connect("mongodb://localhost/movies", { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    checkUser();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
