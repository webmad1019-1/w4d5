const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const Car = require("./models/Car");

function createUser() {
  const saltRounds = 10;
  const plainPassword1 = "123";
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt)

  User.deleteMany().then(() => {
    User.create({
      name: "Quique",
      password: hash
    }).then(userCreated => {
      
      console.log("The password is correct " + bcrypt.compareSync("1234", hash))

      Car.deleteMany().then(() => {
        Car.create({
          plaque: "XDVFFFF122",
          make: "Honda",
          owner: userCreated._id
        }).then(carCreated => {
          console.log("I have finished!");
          process.exit(0);
        });
      });
    });
  });
}

mongoose
  .connect("mongodb://localhost/movies", { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    createUser();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
