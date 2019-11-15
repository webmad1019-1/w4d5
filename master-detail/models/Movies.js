const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: String,
    year: Number,
    rate: Number,
    director: { type : Schema.Types.ObjectId, ref: 'Directors' },
    duration: String,
    genre: [String]
  },
  { timestamps: true }
);

const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;
